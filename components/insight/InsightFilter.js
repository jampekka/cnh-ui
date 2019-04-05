import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import { Typeahead } from 'react-bootstrap-typeahead';


function InsightFilter(props) {
  const options = props.nodes
    .filter(node => node.indicator_level === 'strategic')
    .map((node) => {
      const out = {};
      out.id = node.id;
      out.label = node.name;
      return out;
    });

  function handleChange(data) {
    const selectedNode = data[0];
    let nodeId;

    if (selectedNode) {
      nodeId = selectedNode.id;
    } else {
      nodeId = null;
    }
    props.onFilterNode(nodeId);
  }

  return (
    <Container>
      <Row>
        <Col>
          <h5>Suodata mittarin perusteella</h5>
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <Typeahead id="insight-filter"
            onChange={handleChange}
            ignoreDiacritics={false}
            clearButton
            emptyLabel="Ei osumia"
            options={options}
           />
        </Col>
      </Row>
    </Container>
  );
}

export default InsightFilter;
