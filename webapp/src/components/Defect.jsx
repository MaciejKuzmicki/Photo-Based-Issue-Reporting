import {Card, Col, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {DateFormatting} from "../utils/DateFormatting";
import {DefectService} from "../services/Defect";
import {useState} from "react";
import Form from "react-bootstrap/Form";

function Defect({defect: initialDefect}) {
    const [defect, setDefect] = useState(initialDefect);
    const handleFixButton = async () => {
        const response = await DefectService.markAsFixed(defect.id);
        if(response) {
            setDefect(response);
        }
    }
    return (
        <Card style={{ width: '72rem', borderRadius: '15px' }}>
            <Row noGutters={true}>
                <Col md={4}>
                    <Card.Img variant="top" style={{borderRadius: '15px'}} src={defect.imageUrl} />
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
                            <Form onSubmit={handleFixButton}>
                                <Button type="submit" variant="primary">Mark as fixed</Button>
                            </Form>
                        ) : <Button variant="secondary" disabled>Fixed</Button>}
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    );
}

export default Defect;