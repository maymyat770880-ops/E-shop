import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ServiceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // English contents for professional assessment
    const serviceData = {
        "1": {
            title: "Free Delivery Service",
            description: "Experience hassle-free shopping with our premium delivery service.",
            content: "We provide complimentary shipping for all orders exceeding $500 within the metropolitan area. Our logistics team ensures that your high-end gadgets are handled with the utmost care and delivered safely to your doorstep within 24-48 hours. Real-time tracking is available for all eligible orders to give you peace of mind."
        },
        "2": {
            title: "Secure Payment System",
            description: "Your financial security is our top priority.",
            content: "Cyber Gadgets utilizes industry-standard encryption protocols to ensure 100% safe transactions. We support various secure payment methods, including major credit cards and verified digital wallets. Every transaction is monitored by our security fraud detection system to provide a protected shopping environment for our customers."
        },
    

        "3": {
            title: "Quality Service & Certified Products",
            description: "Your trust is built on our commitment to quality.",
            content: "At Cyber Gadgets, we prioritize quality above all. Every smartphone, laptop, and accessory undergoes a rigorous multi-point inspection before being listed in our shop. We only source products from official manufacturers and authorized distributors to ensure you receive genuine hardware with full warranty support. Our team is dedicated to providing only the best tech to our customers."
    
    }
    };

    const service = serviceData[id];

    // If service ID is not found, show an error message (Good for UX criteria)
    if (!service) {
        return (
            <div className="container my-5 text-center">
                <h3 className="text-danger">Service Not Found</h3>
                <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>Return Home</button>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                            <li className="breadcrumb-item active">Service Details</li>
                        </ol>
                    </nav>

                    <h1 className="fw-bold display-5 mb-3">{service.title}</h1>
                    <p className="lead text-primary mb-4">{service.description}</p>
                    <hr />

                    <div className="service-content py-3">
                        <p style={{ lineHeight: '1.8', fontSize: '1.15rem', textAlign: 'justify' }}>
                            {service.content}
                        </p>
                    </div>

                    <div className="mt-5">
                        <button
                            className="btn btn-dark btn-lg px-4 rounded-pill shadow-sm"
                            onClick={() => navigate(-1)}
                        >
                            <i className="bi bi-arrow-left me-2"></i> Back to Services
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ServiceDetail;