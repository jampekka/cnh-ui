import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody, CardTitle, Alert,
} from 'reactstrap';
import styled from 'styled-components';
import { IndicatorLink } from '../../common/links';

const Indicator = styled(Card)`
  hyphens: auto;
  line-height: 1;
  margin-bottom: 1em;
  border-radius: 6px;
  color: ${(props) => {
    switch (props.level) {
      case 'action':
        return '#ffffff';
      case 'operational':
        return '#000000';
      case 'tactical':
        return '#000000';
      case 'strategic':
        return '#ffffff';
      default:
        return '#000000';
    }
  }};
  background-color: ${(props) => {
    switch (props.level) {
      case 'action':
        return props.theme.actionColor;
      case 'operational':
        return props.theme.operationalIndicatorColor;
      case 'tactical':
        return props.theme.tacticalIndicatorColor;
      case 'strategic':
        return props.theme.strategicIndicatorColor;
      default:
        return '#cccccc';
    }
  }};

  a {
    color: inherit;
  }
`;

const IndicatorType = styled.div`
  opacity: .75;
  font-size: 75%;
  margin-bottom: .5em;
`;

const IndicatorNumber = styled.span`
  display: block;
`;

const IndicatorTitle = styled(CardTitle)`
  font-weight: 600;
`;

function getLevelName(level) {
  switch (level) {
    case 'action':
      return 'Toimenpide';
    case 'operational':
      return 'Toiminnallinen mittari';
    case 'tactical':
      return 'Taktinen mittari';
    case 'strategic':
      return 'Strateginen mittari';
    default:
      return '';
  }
}

function IndicatorCard(props) {
  const {
    level, objectid, name, number,
  } = props;


  return (
    <IndicatorLink id={objectid}>
      <a href>
        <Indicator level={level} key={objectid}>
          <CardBody>
            <div>
              <IndicatorType>{ getLevelName(level) }</IndicatorType>
              <IndicatorTitle>
                { number && <IndicatorNumber>{ number }</IndicatorNumber> }
                { name }
              </IndicatorTitle>
            </div>
          </CardBody>
        </Indicator>
      </a>
    </IndicatorLink>
  );
}

IndicatorCard.defaultProps = {
  number: null,
};

IndicatorCard.propTypes = {
  level: PropTypes.string.isRequired,
  objectid: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  number: PropTypes.number,
};

export default IndicatorCard;
