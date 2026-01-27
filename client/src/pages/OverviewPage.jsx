import React from 'react';
import DailySalesChart from '../components/DailySalesChart';
import QuantitySoldDashboard from '../components/QuantitySoldDashboard';
import RevenuePerProductChartPerProduct from '../components/RevenueDashboardPerProduct';
import RevenuePerProductChartPerSeller from '../components/RevenuePerSeller';
import RevenuePerCategoryDashboard from '../components/RevenuePerCategory';
import MonthlyRevenuePerYear from '../components/MonthlyRevenuePerYear';
import MonthlySalesTrend from '../components/MonthlySalesTrend';
import MonthlyOrderCount from '../components/monthlyOrderCount';
import AverageOrderValue from '../components/averageOrderValue';
import CustomerLifetimeValue from '../components/customerLifetimeValue';

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
                <MonthlySalesTrend />
            </section>
            <section style={{ marginBottom: '50px' }}>
                <AverageOrderValue />
            </section>
            <section style={{ marginBottom: '50px' }}>
                <CustomerLifetimeValue />
            </section>
        </div>
    );
}
