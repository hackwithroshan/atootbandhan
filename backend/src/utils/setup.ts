import Plan from '../models/Plan.js';
import Faq from '../models/Faq.js';
import SuccessStory from '../models/SuccessStory.js';
import User from '../models/User.js';
import Transaction, { TransactionStatus } from '../models/Transaction.js';
import Offer from '../models/Offer.js';
import Coupon, { DiscountType } from '../models/Coupon.js';
import NotificationCampaign from '../models/NotificationCampaign.js';
import AutomatedReminder from '../models/AutomatedReminder.js';
import AnnouncementBanner from '../models/AnnouncementBanner.js';
import BlogPost from '../models/BlogPost.js';
import StaticPage from '../models/StaticPage.js';
import SiteSetting from '../models/SiteSetting.js';
import SearchLog from '../models/SearchLog.js';
import ABTest from '../models/ABTest.js';
import Affiliate from '../models/Affiliate.js';
import AdminAuditLog from '../models/AdminAuditLog.js';
import { MembershipTier } from '../../../types.js';

export const setupDatabase = async () => {
    console.log('Starting database setup...');
    
    // Clear existing data to prevent duplicates on re-run
    await Plan.deleteMany({});
    await Faq.deleteMany({});
    await SuccessStory.deleteMany({});
    await Transaction.deleteMany({});
    await Offer.deleteMany({});
    await Coupon.deleteMany({});
    await NotificationCampaign.deleteMany({});
    await AutomatedReminder.deleteMany({});
    await AnnouncementBanner.deleteMany({});
    await BlogPost.deleteMany({});
    await StaticPage.deleteMany({});
    await SiteSetting.deleteMany({});
    await SearchLog.deleteMany({});
    await ABTest.deleteMany({});
    await Affiliate.deleteMany({});
    await AdminAuditLog.deleteMany({});


    // Create Site Settings (Singleton)
    await SiteSetting.create({
        siteTitle: 'Atut Bandhan - Find Your Partner',
        homepageBannerText: 'Jodiyan Banti Hain Yahan, Rishte Judte Hain Dil Se',
        homepageCtaText: 'Join Now – It’s Free',
        defaultMetaTitle: 'Atut Bandhan - Matrimonial Site for Serious Relationships',
        defaultMetaDescription: 'Find your life partner on Atut Bandhan, a trusted platform for creating lasting bonds.',
        contactEmail: 'contact@atutbandhan.com',
        contactMobile: '+91-1234567890',
        referralBonus: 150,
    });
    console.log('Default Site Settings created.');


    // Create Membership Plans
    const plans = [
        {
            name: MembershipTier.FREE,
            priceMonthlyDisplay: '₹0 / month',
            priceMonthly: 0,
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
            priceMonthlyDisplay: '₹499 / month',
            priceMonthly: 499,
            priceYearlyDisplay: 'or ₹4999 / year',
            priceYearly: 4999,
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
            priceMonthlyDisplay: '₹999 / month',
            priceMonthly: 999,
            priceYearlyDisplay: 'or ₹9999 / year',
            priceYearly: 9999,
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
            priceMonthlyDisplay: '₹1999 / month',
            priceMonthly: 1999,
            priceYearlyDisplay: 'or ₹19999 / year',
            priceYearly: 19999,
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

    // Create FAQs and Static Pages
    const faqs = [
        { question: 'How do I create a profile?', answer: 'Simply click on the "Sign Up" button and follow the multi-step form. Make sure to verify your email to complete the registration.' },
        { question: 'Is my data safe?', answer: 'Yes, we take your privacy very seriously. You have full control over who can see your photos and contact information. All data is securely stored.' },
        { question: 'How does matching work?', answer: 'Our AI-powered algorithm suggests matches based on your profile details and partner preferences. The more complete your profile, the better the matches!' },
        { question: 'How can I upgrade my plan?', answer: 'Navigate to the "Membership" section in your dashboard to view and select from our available premium plans.' },
    ];
    await Faq.insertMany(faqs);
    console.log(`${faqs.length} FAQs created.`);
    
    await StaticPage.insertMany([
        { slug: 'faq', title: 'Frequently Asked Questions', content: 'This content is managed from the FAQs model for now. A dedicated editor will be provided.' },
        { slug: 'terms', title: 'Terms & Conditions', content: '<h1>Terms of Service</h1><p>Please read these terms carefully...</p>' },
        { slug: 'privacy', title: 'Privacy Policy', content: '<h1>Privacy Policy</h1><p>Your privacy is important to us...</p>' },
    ]);
    console.log('3 Static Pages created.');


    // Create Blog Posts
    const blogPosts = [
        {
            title: '5 Tips for a Great First Date',
            excerpt: 'Make your first meeting memorable with these simple yet effective tips.',
            imageUrl: 'https://images.unsplash.com/photo-1544365558-35aa4afcf11f?q=80&w=2070&auto=format&fit=crop',
            content: '<h2>Tip 1: Choose the Right Venue...</h2><p>A quiet cafe is often better than a loud bar.</p>',
            category: 'Dating Tips',
            seoTags: ['first date', 'dating advice', 'tips'],
        },
        {
            title: 'Understanding Compatibility in Relationships',
            excerpt: 'What does compatibility really mean? We break down the key elements of a lasting connection.',
            imageUrl: 'https://images.unsplash.com/photo-1529281220038-51711a3f6567?q=80&w=2070&auto=format&fit=crop',
            content: '<h2>Core Values are Key...</h2><p>Shared values form the foundation of a strong relationship.</p>',
            category: 'Relationships',
            seoTags: ['compatibility', 'relationships', 'marriage'],
        }
    ];
    await BlogPost.insertMany(blogPosts);
    console.log(`${blogPosts.length} Blog Posts created.`);

    
    // Create Success Stories
    const stories = [
        {
            coupleName: 'Rohan & Priya',
            storyText: 'We met on Atut Bandhan and felt an instant connection. The platform made it easy to find someone with shared values. Thank you for bringing us together!',
            imageUrl: 'https://images.unsplash.com/photo-1599549352465-3c8b57a64112?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%D%D%D',
            weddingDate: 'Married on 12 Dec 2023',
            status: 'Approved',
        },
        {
            coupleName: 'Amit & Sneha',
            storyText: 'After searching for a long time, we finally found each other on this amazing platform. The profiles are genuine, and the features are very helpful.',
            imageUrl: 'https://images.unsplash.com/photo-1607901991209-6a8041c4b4a6?q=80&w=1974&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%D%D%D',
            weddingDate: 'Married on 20 Feb 2024',
            status: 'Pending',
        },
        {
            coupleName: 'Vikram & Anjali',
            storyText: 'We are so grateful to Atut Bandhan. The user interface is simple and the verification process ensures you are talking to real people. Highly recommended!',
            imageUrl: 'https://images.unsplash.com/photo-1591953903144-846c4f3b1dfe?q=80&w=1974&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%D%D%D',
            weddingDate: 'Married on 05 May 2024',
            status: 'Approved',
        }
    ];
    await SuccessStory.insertMany(stories);
    console.log(`${stories.length} Success Stories created.`);

    // Create Offers
    const today = new Date();
    const offers = [
        {
            title: 'Monsoon Bonanza',
            image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=1935&auto=format&fit=crop',
            description: 'Get 20% off on Gold Membership this rainy season. Find your perfect match!',
            buttonText: 'Upgrade Now & Save 20%',
            link: '/dashboard/membership',
            startDate: new Date(today.getFullYear(), today.getMonth(), 1), // Start of current month
            endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0), // End of current month
            status: 'Published',
        },
        {
            title: 'Diwali Special Offer',
            image: 'https://images.unsplash.com/photo-1604202525964-b3d5a153a395?q=80&w=2070&auto=format&fit=crop',
            description: 'Celebrate the festival of lights with a 30% discount on all yearly plans.',
            buttonText: 'Claim Diwali Discount',
            link: '/dashboard/membership',
            startDate: new Date(today.getFullYear(), 9, 20), // Approx. Diwali start
            endDate: new Date(today.getFullYear(), 10, 10), // Approx. Diwali end
            status: 'Published',
        },
        {
            title: 'New Year, New Beginnings',
            image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=2069&auto=format&fit=crop',
            description: 'Start your search in the new year with a special 15% discount.',
            buttonText: 'Get Started',
            link: '/dashboard/membership',
            startDate: new Date(today.getFullYear() - 1, 11, 25), // Last year
            endDate: new Date(today.getFullYear(), 0, 10), // This year Jan
            status: 'Published', // It's published but expired by date
        },
        {
            title: 'Holi Festival Fun',
            image: 'https://images.unsplash.com/photo-1616494291142-a74d779a1a5b?q=80&w=2070&auto=format&fit=crop',
            description: 'Add color to your life! Special offer for Holi.',
            buttonText: 'View Offer',
            link: '/dashboard/membership',
            startDate: new Date(today.getFullYear(), 2, 20),
            endDate: new Date(today.getFullYear(), 2, 30),
            status: 'Draft',
        }
    ];
    await Offer.insertMany(offers);
    console.log(`${offers.length} sample offers created.`);

    // Create Coupons
    const coupons = [
        {
            code: 'FIRST100',
            discountType: DiscountType.FIXED,
            discountValue: 100,
            expiryDate: new Date(today.getFullYear(), today.getMonth() + 2, 0), // End of next month
            status: 'Active',
        },
        {
            code: 'DIWALI20',
            discountType: DiscountType.PERCENTAGE,
            discountValue: 20,
            expiryDate: new Date(today.getFullYear(), 10, 15),
            status: 'Active',
        },
        {
            code: 'EXPIRED50',
            discountType: DiscountType.FIXED,
            discountValue: 50,
            expiryDate: new Date(today.getFullYear(), today.getMonth() - 1, 1),
            status: 'Active', // Let's keep it active to test expiry logic
        }
    ];
    await Coupon.insertMany(coupons);
    console.log(`${coupons.length} sample coupons created.`);

    // Create some transactions for existing users
    const users = await User.find({ role: 'user' }).limit(5);
    if (users.length >= 3) {
        const transactions = [
            {
                user: users[0].id,
                plan: MembershipTier.GOLD,
                amount: 999,
                currency: 'INR',
                paymentId: `pay_${Math.random().toString(36).slice(2, 11)}`,
                orderId: `order_${Math.random().toString(36).slice(2, 11)}`,
                status: TransactionStatus.SUCCESS,
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            },
            {
                user: users[1].id,
                plan: MembershipTier.SILVER,
                amount: 499,
                currency: 'INR',
                paymentId: `pay_${Math.random().toString(36).slice(2, 11)}`,
                orderId: `order_${Math.random().toString(36).slice(2, 11)}`,
                status: TransactionStatus.SUCCESS,
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
            },
            {
                user: users[2].id,
                plan: MembershipTier.GOLD,
                amount: 999,
                currency: 'INR',
                paymentId: `pay_${Math.random().toString(36).slice(2, 11)}`,
                orderId: `order_${Math.random().toString(36).slice(2, 11)}`,
                status: TransactionStatus.FAILED,
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            }
        ];
        await Transaction.insertMany(transactions);
        console.log(`${transactions.length} sample transactions created.`);
    } else {
        console.log('Not enough users found to create sample transactions.');
    }

    console.log('Database setup finished.');
};