import CustomNavbar from "../components/Navbar";
import {useEffect, useState} from "react";
import {DefectService} from "../services/Defect";
import Defect from "../components/Defect";
import Map from "../components/Map";
import {Dropdown} from "react-bootstrap";

function MainPage() {
    const [defects, setDefects] = useState([]);
    const [isFixed, setIsFixed] = useState("All");
    const [category, setCategory] = useState("All");

    const fetchData = async () => {
        try {
            const response = await DefectService.getDefects(isFixed, category);
            console.log(response);
            setDefects(response);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, [isFixed, category]);

    return (
        <div>
            <CustomNavbar/>


            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
                <Map defectsDetails={defects}/>
                <br />
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Dropdown style={{marginRight: '16rem'}}>
                        <Dropdown.Toggle variant="secondary" id="dropdown-fixed">
                            Fixed: {isFixed}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setIsFixed("All")}>All</Dropdown.Item>
                            <Dropdown.Item onClick={() => setIsFixed("True")}>True</Dropdown.Item>
                            <Dropdown.Item onClick={() => setIsFixed("False")}>False</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Toggle variant="secondary" id="dropdown-category">
                            Category: {category}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setCategory("All")}>All</Dropdown.Item>
                            <Dropdown.Item onClick={() => setCategory("None")}>None</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <br />
                {defects != null ? (
                    defects.map(item => (
                        <Defect key={item.id} defect={item}/>
                    ))
                ) : (
                    <p>No defects found</p>
                )}
            </div>
        </div>
    );

}

export default MainPage;