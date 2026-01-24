import React from 'react';
import DailySalesChart from '../components/DailySalesChart';
import QuantitySoldDashboard from '../components/QuantitySoldDashboard';
import RevenuePerProductChartPerProduct from '../components/RevenueDashboardPerProduct';
import RevenuePerProductChartPerSeller from '../components/RevenuePerSeller';
import RevenuePerCategoryDashboard from '../components/RevenuePerCategory';

export default function OverviewPage() {
    return (
        <div>
            <h1 style={{ marginBottom: '24px', color: '#333' }}>Sales Overview</h1>

            <section style={{ marginBottom: '50px' }}>
                <DailySalesChart />
            </section>

            <section style={{ marginBottom: '50px' }}>
                <QuantitySoldDashboard />
            </section>

            <section style={{ marginBottom: '50px' }}>
                <RevenuePerProductChartPerProduct />
            </section>

            <section style={{ marginBottom: '50px' }}>
                <RevenuePerProductChartPerSeller />
            </section>

            <section style={{ marginBottom: '50px' }}>
                <RevenuePerCategoryDashboard />
            </section>
        </div>
    );
}
