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
            {defects.length > 0 ? (
                defects.map(item => (
                    <Defect key={item.id} defect={item} />
                ))
            ) : (
                <p>No defects found</p>
            )}
        </div>
    );

}

export default MainPage;