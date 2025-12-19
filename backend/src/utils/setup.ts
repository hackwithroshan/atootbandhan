import Plan from '../models/Plan.js';
import Faq from '../models/Faq.js';
import SuccessStory from '../models/SuccessStory.js';
import { MembershipTier } from '../../types.js';

export const setupDatabase = async () => {
    console.log('Starting database setup...');
    
    // Clear existing data to prevent duplicates on re-run
    await Plan.deleteMany({});
    await Faq.deleteMany({});
    await SuccessStory.deleteMany({});

    // Create Membership Plans
    const plans = [
        {
            name: MembershipTier.FREE,
            priceMonthly: '₹0 / month',
            cta: 'Current Plan',
            features: [
                { text: '5 Matches Per Day', included: true },
                { text: '3 Interests Per Day', included: true },
                { text: 'View Full Profiles', included: false },
                { text: 'Chat with Matches', included: false },
                { text: 'View Contact Details', included: false },
            ]
        },
        {
            name: MembershipTier.SILVER,
            priceMonthly: '₹499 / month',
            priceYearly: 'or ₹4999 / year',
            cta: 'Upgrade to Silver',
            features: [
                { text: 'Unlimited Matches', included: true },
                { text: '20 Interests Per Day', included: true },
                { text: 'View Full Profiles', included: true },
                { text: 'Chat with 5 Matches', included: true },
                { text: 'View Contact Details', included: false },
            ]
        },
        {
            name: MembershipTier.GOLD,
            priceMonthly: '₹999 / month',
            priceYearly: 'or ₹9999 / year',
            highlight: true,
            cta: 'Upgrade to Gold',
            features: [
                { text: 'Unlimited Matches', included: true },
                { text: 'Unlimited Interests', included: true },
                { text: 'View Full Profiles', included: true },
                { text: 'Unlimited Chat', included: true },
                { text: 'View 10 Contact Details', included: true },
                { text: 'Profile Boost', included: true },
            ]
        },
        {
            name: MembershipTier.DIAMOND,
            priceMonthly: '₹1999 / month',
            priceYearly: 'or ₹19999 / year',
            cta: 'Upgrade to Diamond',
            features: [
                { text: 'All Gold Benefits', included: true },
                { text: 'Priority Support', included: true },
                { text: 'See Who Viewed You', included: true },
                { text: 'Advanced Astrology', included: true },
                { text: 'Profile Spotlight', included: true },
            ]
        }
    ];
    await Plan.insertMany(plans);
    console.log(`${plans.length} Membership Plans created.`);

    // Create FAQs
    const faqs = [
        { question: 'How do I create a profile?', answer: 'Simply click on the "Sign Up" button and follow the multi-step form. Make sure to verify your email to complete the registration.' },
        { question: 'Is my data safe?', answer: 'Yes, we take your privacy very seriously. You have full control over who can see your photos and contact information. All data is securely stored.' },
        { question: 'How does matching work?', answer: 'Our AI-powered algorithm suggests matches based on your profile details and partner preferences. The more complete your profile, the better the matches!' },
        { question: 'How can I upgrade my plan?', answer: 'Navigate to the "Membership" section in your dashboard to view and select from our available premium plans.' },
    ];
    await Faq.insertMany(faqs);
    console.log(`${faqs.length} FAQs created.`);
    
    // Create Success Stories
    const stories = [
        {
            coupleName: 'Rohan & Priya',
            storyText: 'We met on Atut Bandhan and felt an instant connection. The platform made it easy to find someone with shared values. Thank you for bringing us together!',
            imageUrl: 'https://images.unsplash.com/photo-1599549352465-3c8b57a64112?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            weddingDate: 'Married on 12 Dec 2023',
            status: 'Approved',
        },
        {
            coupleName: 'Amit & Sneha',
            storyText: 'After searching for a long time, we finally found each other on this amazing platform. The profiles are genuine, and the features are very helpful.',
            imageUrl: 'https://images.unsplash.com/photo-1607901991209-6a8041c4b4a6?q=80&w=1974&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            weddingDate: 'Married on 20 Feb 2024',
            status: 'Approved',
        },
        {
            coupleName: 'Vikram & Anjali',
            storyText: 'We are so grateful to Atut Bandhan. The user interface is simple and the verification process ensures you are talking to real people. Highly recommended!',
            imageUrl: 'https://images.unsplash.com/photo-1591953903144-846c4f3b1dfe?q=80&w=1974&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            weddingDate: 'Married on 05 May 2024',
            status: 'Approved',
        }
    ];
    await SuccessStory.insertMany(stories);
    console.log(`${stories.length} Success Stories created.`);

    console.log('Database setup finished.');
};