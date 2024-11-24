// src/components/SupersetDashboard.js

import React from 'react';
import './SupersetDashboard.css'; // Optional: For custom styling

function SupersetDashboard() {
    const supersetUrl = 'http://127.0.0.1:8088/superset/dashboard/8/?native_filters_key=qJpz-V_-8s4GCsvVi9HDaHl8wD2fd4hpKX_TxD5dpQEC1bYUouA1rno9uMlaZLtS'; // Replace with your dashboard URL

    return (
        <div className="SupersetDashboard">
            <iframe
                src={supersetUrl}
                title="Superset Dashboard"
                width="100%"
                height="100%"
                frameBorder="0"
                allowTransparency="true"
            ></iframe>
        </div>
    );
}

export default SupersetDashboard;
