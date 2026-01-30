import React from "react";
import {
    BarChart3,
    TrendingUp,
    Package,
    Users,
    ShoppingCart,
    ArrowRight,
} from "lucide-react";

export default function LandingPage({ onEnterDashboard }) {
    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            {/* Navigation */}
            <nav style={{
                padding: "20px 40px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backdropFilter: "blur(10px)",
                background: "rgba(255, 255, 255, 0.1)"
            }}>
                <h1 style={{ color: "white", fontSize: "28px", fontWeight: "bold", margin: 0 }}>
                    SalesDB
                </h1>
                <button
                    onClick={onEnterDashboard}
                    style={{
                        padding: "10px 30px",
                        background: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "transform 0.2s",
                        color: "#667eea"
                    }}
                    onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                    onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                >
                    Dashboard
                </button>
            </nav>

            {/* Hero Section */}
            <section style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "60vh",
                textAlign: "center",
                color: "white",
                padding: "40px 20px"
            }}>
                <div style={{ maxWidth: "800px" }}>
                    <h2 style={{
                        fontSize: "56px",
                        fontWeight: "bold",
                        marginBottom: "20px",
                        lineHeight: "1.2"
                    }}>
                        Real-Time Sales Analytics
                    </h2>
                    <p style={{
                        fontSize: "20px",
                        marginBottom: "40px",
                        opacity: "0.95",
                        lineHeight: "1.6"
                    }}>
                        Transform your e-commerce data into actionable insights. Track sales, revenue, and performance across products, sellers, and categories.
                    </p>
                    <button
                        onClick={onEnterDashboard}
                        style={{
                            padding: "16px 50px",
                            fontSize: "18px",
                            fontWeight: "bold",
                            background: "white",
                            color: "#667eea",
                            border: "none",
                            borderRadius: "50px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "10px",
                            transition: "transform 0.2s, box-shadow 0.2s",
                            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)"
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = "translateY(-3px)";
                            e.currentTarget.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.3)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.2)";
                        }}
                    >
                        Enter Sales DB <ArrowRight size={20} />
                    </button>
                </div>
            </section>

            {/* Features Section */}
            <section style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "80px 40px",
                backdropFilter: "blur(10px)"
            }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    <h3 style={{
                        fontSize: "40px",
                        fontWeight: "bold",
                        color: "white",
                        textAlign: "center",
                        marginBottom: "60px"
                    }}>
                        Key Features
                    </h3>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "30px"
                    }}>
                        {[
                            {
                                icon: BarChart3,
                                title: "Daily Sales Tracking",
                                desc: "Monitor your daily sales performance with year-over-year comparisons"
                            },
                            {
                                icon: Package,
                                title: "Product Analytics",
                                desc: "Analyze revenue and quantity sold across your entire product catalog"
                            },
                            {
                                icon: Users,
                                title: "Seller Performance",
                                desc: "Track revenue contribution from each seller in your network"
                            },
                            {
                                icon: ShoppingCart,
                                title: "Category Insights",
                                desc: "Understand which product categories drive the most revenue"
                            },
                            {
                                icon: TrendingUp,
                                title: "Trend Analysis",
                                desc: "Visualize sales trends and identify growth opportunities"
                            },
                            {
                                icon: BarChart3,
                                title: "Real-Time Data",
                                desc: "Get instant access to your latest sales data and metrics"
                            }
                        ].map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={idx}
                                    style={{
                                        background: "rgba(255, 255, 255, 0.1)",
                                        padding: "30px",
                                        borderRadius: "12px",
                                        border: "1px solid rgba(255, 255, 255, 0.2)",
                                        color: "white",
                                        transition: "transform 0.3s, background 0.3s"
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = "translateY(-5px)";
                                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                                    }}
                                >
                                    <Icon size={40} style={{ marginBottom: "15px", color: "#ffd700" }} />
                                    <h4 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>
                                        {feature.title}
                                    </h4>
                                    <p style={{ opacity: "0.9", lineHeight: "1.5" }}>
                                        {feature.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                textAlign: "center",
                padding: "80px 40px",
                color: "white"
            }}>
                <h3 style={{
                    fontSize: "40px",
                    fontWeight: "bold",
                    marginBottom: "20px"
                }}>
                    Ready to dive into your sales data?
                </h3>
                <p style={{
                    fontSize: "18px",
                    marginBottom: "40px",
                    opacity: "0.95"
                }}>
                    Get comprehensive insights into your e-commerce performance today.
                </p>
                <button
                    onClick={onEnterDashboard}
                    style={{
                        padding: "16px 50px",
                        fontSize: "18px",
                        fontWeight: "bold",
                        background: "white",
                        color: "#667eea",
                        border: "none",
                        borderRadius: "50px",
                        cursor: "pointer",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)"
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.3)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.2)";
                    }}
                >
                    View Dashboard
                </button>
            </section>

            {/* Footer */}
            <footer style={{
                background: "rgba(0, 0, 0, 0.2)",
                color: "white",
                textAlign: "center",
                padding: "30px",
                marginTop: "40px"
            }}>
                <p style={{ margin: 0, opacity: "0.8" }}>
                    © 2026 SalesDB. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
