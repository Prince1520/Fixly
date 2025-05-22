import { useState } from 'react';
import axios from 'axios';

const FeedbackForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        issueType: '',
        fullName: '',
        email: '',
        mobile: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // You can call your backend API here
            const response = await axios.post('http://localhost:3001/feedback', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status < 200 || response.status >= 300) {
                throw new Error('Failed to submit feedback');
            }

            // Call the onSubmit prop if provided
            if (onSubmit) {
                onSubmit(formData);
            }

            setSubmitSuccess(true);
            setFormData({
                issueType: '',
                fullName: '',
                email: '',
                mobile: '',
                message: ''
            });

            // Reset success message after 3 seconds
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 3000);
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="relative isolate overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 h-80% w-screen py-24 sm:py-32">
                <img
                    alt=""
                    src="https://as1.ftcdn.net/jpg/04/40/60/52/1000_F_440605293_6X4ppLXz5GM13rZuBELltnylE7FHvepP.jpg"
                    className="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center opacity-50 blur-xs"
                />

                <div className="mx-auto max-w-7xl lg:px-8">
                    <div className="mx-auto text-center lg:mx-0">
                        <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
                            We Would Love to Hear from You!
                        </h2>
                        <p className="mt-8 text-lg font-medium text-gray-300 sm:text-xl">
                            Your feedback is important to us.
                        </p>
                    </div>
                </div>
            </div>


        <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto p-4 md:p-8 gap-8">
            {/* Feedback form section */}
            <div className="w-full md:w-3/5">
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-6">
                        <select
                            name="issueType"
                            value={formData.issueType}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                            requiblue
                        >
                            <option value="" disabled>How can we help you?*</option>
                            <option value="generalFeedback">General Feedback</option>
                            <option value="orderIssue">Issue with my order</option>
                            <option value="restaurantFeedback">Restaurant Feedback</option>
                            <option value="appIssue">App/Website Problem</option>
                            <option value="paymentIssue">Payment Issue</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Full Name*"
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                            requiblue
                        />
                    </div>

                    <div className="mb-6">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address*"
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                            requiblue
                        />
                    </div>

                    <div className="mb-6">
                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="Mobile Number (optional)"
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                        />
                    </div>

                    <div className="mb-6">
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Type text*"
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent min-h-32 resize-y"
                            rows="6"
                            requiblue
                        ></textarea>
                    </div>

                    {error && <div className="mb-4 text-blue-500 text-sm">{error}</div>}
                    {submitSuccess && <div className="mb-4 text-green-600 text-sm">Thank you for your feedback!</div>}

                    <div className="mb-6">
                        <button
                            type="submit"
                            className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded transition-colors duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit feedback'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Sidebar info boxes */}
            <div className="w-full md:w-2/5 space-y-6">
                {/* Safety Emergency Box */}
        

                {/* Live Order Support Box */}
                <div className="bg-white rounded-lg p-6 shadow-md">
                    <h2 className="text-xl font-medium text-gray-800 mb-3">Get instant help with our chatbot!</h2>
                    <p className="text-gray-600">Click on the blue chatbot icon to get instant support! Select a service, ask about our refund policy, learn how to book a service, contact support, or inquire about previous orders.</p>
                </div>
            </div>
        </div>
        </div>
    );
};

export default FeedbackForm;