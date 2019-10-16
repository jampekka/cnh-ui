/* eslint-disable max-classes-per-file */
import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {
  Container
} from 'reactstrap';
import styled from 'styled-components';
import { withTranslation } from '../../common/i18n';
import ContentLoader from '../common/ContentLoader';
import PlanContext from '../../context/plan';
import ActionListFilters from './ActionListFilters';
import ActionCardList from './ActionCardList';

const ActionListHeader = styled.div`
  padding-top: 3rem;
  background-color: ${(props) => props.theme.brandLight};
`;

export const GET_ACTION_LIST = gql`
  query ActionList($plan: ID!) {
    planActions(plan: $plan) {
      id
      identifier
      name
      officialName
      completion
      plan {
        id
      }
      schedule {
        id
      }
      status {
        id
        identifier
        name
      }
      impact {
        id
        identifier
      }
      categories {
        id
      }
      responsibleParties {
        id
        organization {
          id
          abbreviation
          name
        }
      }
    }
    planCategories(plan: $plan) {
      id
      identifier
      name
      imageUrl
      parent {
        id
      }
      type {
        id
      }
    }
    planOrganizations(plan: $plan) {
      id
      abbreviation
      name
    }
  }
`;


class ActionListFiltered extends React.Component {
  static contextType = PlanContext;

  static getFiltersFromQuery(query) {
    const {
      organization, category, text, impact,
    } = query;
    return {
      organization, category, text, impact,
    };
  }

  constructor(props) {
    super(props);

    this.actions = props.planActions;
    this.cats = props.planCategories;
    this.orgs = props.planOrganizations;
    const filters = { props };

    const catsById = {};
    this.cats.forEach((cat) => {
      catsById[cat.id] = cat;
    });
    this.cats.forEach((cat) => {
      if (cat.parent) {
        cat.parent = catsById[cat.parent.id];
      }
    });

    this.actions.forEach((act) => {
      act.categories = act.categories.map((cat) => catsById[cat.id]);
    });

    this.handleChange = this.handleChange.bind(this);

    // Determine root categories
    this.actions.forEach((action) => {
      let category = action.categories[0];

      while (category.parent) category = category.parent;
      action.rootCategory = category;
    });
  }

  handleChange(filterType, val) {
    const filters = { ...this.props.filters };
    filters[filterType] = val;
    this.setState({
      filters
    });
    this.props.onFilterChange(filters);
  }

  filterActions() {
    const { filters } = this.props;
    const { category, organization, text, impact } = filters;

    const actions = this.actions.filter((item) => {
      if (category && item.rootCategory.id !== category) return false;
      if (organization) {
        if (!item.responsibleParties.find(rp => rp.organization.id === organization)) return false;
      }
      if (impact && (!item.impact || (item.impact.id !== impact))) return false;
      if (text) {
        const searchStr = text.toLowerCase();
        if (item.identifier.toLowerCase().startsWith(searchStr)) return true;
        if (item.name.toLowerCase().search(searchStr) !== -1) return true;
        return false;
      }
      return true;
    });

    return actions;
  }

  render() {
    const { t, filters } = this.props;
    const actions = this.filterActions();
    const impacts = this.context.actionImpacts;
    return (
      <div id="actions">
        <ActionListHeader>
          <Container>
            <h1 className="mb-5">{ t('actions') }</h1>
            <ActionListFilters
              cats={this.cats}
              orgs={this.orgs}
              impacts={impacts}
              filters={filters}
              onChange={this.handleChange}
              actionCount={actions.length}
            />
          </Container>
        </ActionListHeader>
        <Container>
          <ActionCardList actions={actions} />
        </Container>
      </div>
    );
  }
}

ActionListFiltered.propTypes = {
  filters: PropTypes.shape({
    organization: PropTypes.string,
    category: PropTypes.string,
    text: PropTypes.string,
    impact: PropTypes.string,
  }).isRequired,
  planActions: PropTypes.arrayOf(PropTypes.object).isRequired,
  planOrganizations: PropTypes.arrayOf(PropTypes.object).isRequired,
  planCategories: PropTypes.arrayOf(PropTypes.object).isRequired,
};


class ActionList extends React.Component {
  static getFiltersFromQuery(query) {
    return ActionListFiltered.getFiltersFromQuery(query);
  }

  render() {
    const { t, plan, filters, onFilterChange } = this.props;
    return (
      <Query query={GET_ACTION_LIST} variables={{ plan: plan.identifier }}>
        {({ data, loading, error }) => {
          if (loading) return <ContentLoader />;
          if (error) return <p>{ t('error-loading-actions') }</p>;
          return <ActionListFiltered t={t} plan={plan} filters={filters} onFilterChange={onFilterChange} {...data} />;
        }}
      </Query>
    );
  }
}

export default withTranslation('common')(ActionList);
