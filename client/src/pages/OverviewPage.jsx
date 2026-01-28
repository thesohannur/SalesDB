import React from 'react';
import DailySalesChart from '../components/DailySalesChart';
import QuantitySoldDashboard from '../components/QuantitySoldDashboard';
import RevenuePerProductChartPerProduct from '../components/RevenueDashboardPerProduct';
import RevenuePerProductChartPerSeller from '../components/RevenuePerSeller';
import RevenuePerCategoryDashboard from '../components/RevenuePerCategory';
import MonthlyRevenuePerYear from '../components/Phase3_Dashboard/MonthlyRevenuePerYear';
import MonthlyOrderCount from '../components/Phase3_Dashboard/MonthlyOrderCount';
import MonthlySalesTrendDashboard from '../components/Phase3_Dashboard/MonthlySalesTrend';
import AverageOrderValueDashboard from '../components/Phase3_Dashboard/AOVDashboard';
import CustomerLifetimeValueDashboard from '../components/Phase3_Dashboard/CLTVDashboard';

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

             <section style={{ marginBottom: '50px' }}>
                <MonthlyRevenuePerYear />
            </section>

             <section style={{ marginBottom: '50px' }}>
                <MonthlyOrderCount />
            </section>

            <section style={{ marginBottom: '50px' }}>
                <MonthlySalesTrendDashboard />
            </section>

            <section style={{ marginBottom: '50px' }}>
                <AverageOrderValueDashboard />
            </section>

            <section style={{ marginBottom: '50px' }}>
                <CustomerLifetimeValueDashboard />
            </section>
        </div>
    );
}
