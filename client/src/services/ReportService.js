import React from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/report";

class ReportService {
    async getReports() {
        return await axios.get(`${API_URL}/get`);
    }
    
    async getReportById(reportId) {
        return await axios.get(`${API_URL}/getbyid/${reportId}`);
    }
    
    async getReportsByReportedUserId(userId) {
        return await axios.get(`${API_URL}/getbyreporteduser/${userId}`);
    }
    
    async postReport(reportingUserId, reportedUserId, petId, description, token) {
        const config = {
        headers: { Authorization: `Bearer ${token}` },
        };

        const petBody = {
            reportingUserId: reportingUserId,
            reportedUserId: reportedUserId,
            petId: petId,
            description: description
        }
    
        return await axios.post(`${API_URL}/add`, petBody, config);
        
    }

    async setReportingUser(reportId, reportingUserId, token) {
        const config = {
        headers: { Authorization: `Bearer ${token}` },
        };
    
        return await axios.put(`${API_URL}/setreportinguser/${reportId}/${reportingUserId}`, null, config);
    }

    async setReportedUser(reportId, reportedUserId, token) {
        const config = {
        headers: { Authorization: `Bearer ${token}` },
        };
    
        return await axios.put(`${API_URL}/setreporteduser/${reportId}/${reportedUserId}`, null, config);
    }

    async setReportingPet(reportId, petId, token) {
        const config = {
        headers: { Authorization: `Bearer ${token}` },
        };
    
        return await axios.put(`${API_URL}/setreportingpet/${reportId}/${petId}`, null, config);
    }


    async validateReport(reportId, token) {
        const config = {
        headers: { Authorization: `Bearer ${token}` },
        };
    
        return await axios.put(`${API_URL}/validate/${reportId}`, {}, config);
    }
    
    async deleteReport(reportId, reportingUserId, token) {
        const config = {
        headers: { Authorization: `Bearer ${token}` },
        };
    
        return await axios.delete(`${API_URL}/delete/${reportId}/${reportingUserId}`, config);
    }
}
export default new ReportService();