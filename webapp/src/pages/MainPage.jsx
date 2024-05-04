import CustomNavbar from "../components/Navbar";
import {useEffect, useState} from "react";
import {DefectService} from "../services/Defect";
import Defect from "../components/Defect";
import Map from "../components/Map";

function MainPage() {
    const [defects, setDefects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await DefectService.getDefects();
                console.log(response);
                setDefects(response);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <CustomNavbar/>
            <Map defectsDetails={defects}/>
            <br />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
                {defects.length > 0 ? (
                    defects.map(item => (
                        <Defect key={item.id} defect={item} />
                    ))
                ) : (
                    <p>No defects found</p>
                )}
            </div>
        </div>
    );

}

export default MainPage;