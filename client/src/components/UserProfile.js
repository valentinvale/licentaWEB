import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import PetListComponent from './PetListComponent';
import UserService from '../services/UserService';
import PetService from '../services/PetService';
import ReportService from '../services/ReportService';
import PetCardFrame from './PetCardFrame';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import '../Styles/my-button.css';
import '../Styles/UserProfile.css';

const UserProfile = () => {
    const auth = useAuth();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('userId');
    const [user, setUser] = useState(null);
    const [userReports, setUserReports] = useState([]);
    const [userPets, setUserPets] = useState([]);
    const [userAdoptedPets, setUserAdoptedPets] = useState([]);
    const [reportText, setReportText] = useState('');
    const [selectedPetIdForReport, setSelectedPetIdForReport] = useState(null);

    useEffect(() => {
        UserService.getUserByIdSafe(userId).then((response) => {
            console.log(response.data);
            setUser(response.data);
            ReportService.getReportsByReportedUserId(userId).then((response) => {
                console.log(response.data);
                setUserReports(response.data);
            });
            PetService.getPetsByUserId(userId).then((response) => {
                setUserPets(response.data);
            });
            PetService.getPetsByAdoptiveUserId(userId).then((response) => {
                setUserAdoptedPets(response.data);
            });
        });
    }, [userId]);

    const handlePostReport = () => {
        ReportService.postReport(auth.user.id, user.id, selectedPetIdForReport, reportText, auth.token).then((response) => {
            const reportId = response.data.id;
            ReportService.setReportingUser(response.data.id, auth.user.id, auth.token).then((response) => {
                ReportService.setReportedUser(reportId, user.id, auth.token).then((response) => {
                    ReportService.setReportingPet(reportId, selectedPetIdForReport, auth.token).then((response) => {
                        console.log(response.data);
                        ReportService.getReportsByReportedUserId(user.id).then((response) => {
                            setUserReports(response.data);
                        });
                        setReportText('');
                    });
                });
            });
        });
    }

    const handleDeleteReport = (reportId) => {
        ReportService.deleteReport(reportId, auth.user.id, auth.token).then((response) => {
            ReportService.getReportsByReportedUserId(user.id).then((response) => {
                setUserReports(response.data);
            });
        });
    }

    const handleValidateReport = (reportId) => {
        ReportService.validateReport(reportId, auth.token).then((response) => {
            ReportService.getReportsByReportedUserId(user.id).then((response) => {
                setUserReports(response.data);
            });
        });
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-12'>
                    <h1>Profilul utilizatorului lui {user ? user.username : ''}</h1>
                </div>
            </div>
            <div className='row'>
                <div className='col-12'>
                    <h2>Animale postate</h2>
                    <PetCardFrame pets={userPets}/>
                </div>
            </div>
            <div className='row'>
                <div className='col-12'>
                    <h2>Animale adoptate</h2>
                    <PetCardFrame pets={userAdoptedPets}/>
                </div>
            </div>
            <div>
                <h2 className='reports-title'>
                    Rapoarte
                </h2>
                {userReports.map(report => (
                    <div key={report.id} className={`report-container ${report.wasCheckedByAdmin ? 'checked' : 'unchecked'} ${report.wasDoneByAdmin ? 'done-by-admin' : ''}`}>
                        {report.wasCheckedByAdmin ? (
                            <i class="bi bi-exclamation-triangle"> Raport verificat de un user specializat</i>
                        ): null
                        }
                        {report.wasDoneByAdmin ? (
                            <i class="bi bi-exclamation-triangle"> Raport facut de un user specializat</i>
                        ): null
                        }
                        <p className='report-text'>
                            {report.description}
                        </p>
                        <p className='reporting-user'>
                            Raportat de: {report.reportingUser.realUsername}
                        </p>
                        <p className='reporting-pet'>
                            Animal raportat: {report.pet.name}
                        </p>
                        <p className='report-date'>
                            Data raportării: {report.dateAdded}
                        </p>
                        {auth.user.id === report.reportingUser.id || auth.user.role === 'ADMIN' ? (
                            <Button className='my-button' onClick={() => handleDeleteReport(report.id)}>Șterge raport</Button>
                        ) : null}
                        {auth.user.role === 'ADMIN' && report.wasCheckedByAdmin === false && report.wasDoneByAdmin === false ? (
                            <Button className='my-button' onClick={() => handleValidateReport(report.id)}>Validează raport</Button>
                        ) : null}
                    </div>
                ))}

                <p>
                    Dacă consideri că acest utilizator încalcă regulile platformei, te rugăm să ne anunți.
                </p>
                <FormGroup>
                    <Label for="report-text-area">
                        Scrie aici motivul pentru care raportezi acest utilizator:
                    </Label>
                    <Input
                    id="report-text-area"
                    name="report-text-area"
                    type="textarea"
                    value={reportText}
                    onChange={(event) => setReportText(event.target.value)}
                    />
                </FormGroup>
                <Label for='pet-select'>Selectează animalul pentru care vrei să raportezi:</Label>
                <Input
                    id='pet-select'
                    name='pet-select'
                    type='select'
                    onChange={(event) => setSelectedPetIdForReport(event.target.value)}
                >
                    <option value=''>Selectează animalul</option>
                    {userPets.map(pet => (
                        <option key={pet.id} value={pet.id}>{pet.name}</option>
                    ))}
                </Input>
                <Button onClick={handlePostReport} className="my-button">Raportează</Button>
            </div>
        </div>
    );
}
export default UserProfile;
