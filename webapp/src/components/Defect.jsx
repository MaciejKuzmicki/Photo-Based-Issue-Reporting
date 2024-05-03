import {Card, Col, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {DateFormatting} from "../utils/DateFormatting";

function Defect({defect}) {

    return (
        <Card style={{ width: '72rem' }}>
            <Row noGutters={true}>
                <Col md={4}>
                    <Card.Img variant="top" src={defect.imageUrl} />
                </Col>
                <Col md={8}>
                    <Card.Body>
                        <Card.Title>
                            <a href={`${defect.location}`}
                               target="_blank"
                               rel="noopener noreferrer"
                               style={{ color: 'inherit', textDecoration: 'none' }}>
                                {defect.locationName}
                            </a>
                        </Card.Title>
                        <Card.Text>
                            Description: {defect.description}
                        </Card.Text>
                        <Card.Text>
                            Date Reported: {DateFormatting.formatDateTime(defect.dateReported)}
                        </Card.Text>
                        <Card.Text>
                            Category: {defect.defectCategory}
                        </Card.Text>
                        {!defect.isFixed ? (
                            <Button variant="primary">Mark as fixed</Button>
                        ) : <p>Fixed</p>}
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    );
}

export default Defect;