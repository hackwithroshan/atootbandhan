import React, { useMemo, useState, useEffect } from 'react';
import Button from '../../ui/Button';
import { CreditCardIcon } from '../../icons/CreditCardIcon';
import { StarIcon } from '../../icons/StarIcon';
import { CheckIcon } from '../../icons/CheckIcon';
import { LockOpenIcon } from '../../icons/LockOpenIcon';
import { XMarkIcon } from '../../icons/XMarkIcon';
import { LoggedInUserSessionData, MembershipTier } from '../../../types';
import apiClient from '../../../utils/apiClient';
import { useToast } from '../../../hooks/useToast';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  _id: string;
  name: string;
  priceMonthly: string;
  priceYearly?: string;
  highlight?: boolean;
  features: PlanFeature[];
  cta: string;
  isCurrent?: boolean;
}

const PlanCard: React.FC<Plan & { isCurrent?: boolean }> = ({ name, priceMonthly, priceYearly, highlight, features, cta, isCurrent }) => (
  <div className={`border rounded-lg p-6 flex flex-col ${highlight && !isCurrent ? 'border-rose-500 shadow-2xl relative scale-105' : 'border-gray-300 shadow-lg bg-white'} ${isCurrent ? 'ring-2 ring-green-500 bg-green-50' : ''}`}>
    {highlight && !isCurrent && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md"><StarIcon className="w-4 h-4 inline-block mr-1" /> Most Popular</div>}
    <h3 className={`text-2xl font-bold ${highlight || isCurrent ? 'text-rose-600' : 'text-gray-800'}`}>{name}</h3>
    <p className="text-xl font-semibold my-2">{priceMonthly}</p>
    {priceYearly && <p className="text-sm text-gray-500 mb-4">{priceYearly}</p>}
    <ul className="space-y-2 mb-6 flex-grow">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-sm">
          {feature.included ? <CheckIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> : <XMarkIcon className="w-4 h-4 text-red-400 mr-2 flex-shrink-0" />}
          <span className={feature.included ? 'text-gray-700' : 'text-gray-400 line-through'}>{feature.text}</span>
        </li>
      ))}
    </ul>
    <Button 
      variant={isCurrent ? "secondary" : (highlight ? "primary" : "secondary")} 
      className={`w-full ${isCurrent ? '!bg-green-600 !text-white !cursor-default' : (highlight ? '!bg-rose-500 hover:!bg-rose-600' : '!bg-rose-100 !text-rose-600 hover:!bg-rose-200')}`}
      onClick={() => isCurrent ? null : console.log(`Clicked ${cta}`)}
      disabled={isCurrent}
    >
      {isCurrent ? <LockOpenIcon className="w-5 h-5 mr-2" /> : null }
      {isCurrent ? 'Current Plan' : cta}
    </Button>
  </div>
);

interface MembershipViewProps {
  loggedInUser: LoggedInUserSessionData;
}

const MembershipView: React.FC<MembershipViewProps> = ({ loggedInUser }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await apiClient('/api/content/plans');
        setPlans(data);
      } catch (err: any) {
        showToast(err.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, [showToast]);

  const currentUserPlan = useMemo(() => {
    return plans.find(plan => plan.name === loggedInUser.membershipTier) || plans.find(plan => plan.name === MembershipTier.FREE) || null;
  }, [plans, loggedInUser.membershipTier]);

  if (isLoading) return <div>Loading membership plans...</div>;
  if (!currentUserPlan) return <div className="text-red-500">Could not determine current plan or load plans.</div>;
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
        <CreditCardIcon className="w-6 h-6 mr-2 text-rose-500" />
        Membership & Upgrades
      </h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Current Plan: <span className="text-rose-600">{currentUserPlan.name}</span></h3>
        <p className="text-sm text-gray-600 mb-1">Status: Active</p>
        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
            {currentUserPlan.name !== MembershipTier.FREE ? (
                <>
                    <div>
                        <p className="text-gray-500">Interests Sent:</p>
                        <p className="font-semibold text-gray-700">Unlimited</p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1"><div className="bg-green-500 h-1.5 rounded-full" style={{width: '100%'}}></div></div>
                    </div>
                    <div>
                        <p className="text-gray-500">Messages Sent:</p>
                        <p className="font-semibold text-gray-700">Unlimited</p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1"><div className="bg-green-500 h-1.5 rounded-full" style={{width: '100%'}}></div></div>
                    </div>
                </>
            ) : (
                 <>
                    <div>
                        <p className="text-gray-500">Interests Sent:</p>
                        <p className="font-semibold text-gray-700">Limited</p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1"><div className="bg-rose-500 h-1.5 rounded-full" style={{width: '30%'}}></div></div>
                    </div>
                    <div>
                        <p className="text-gray-500">Messages Sent:</p>
                        <p className="font-semibold text-gray-700">Limited</p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1"><div className="bg-rose-500 h-1.5 rounded-full" style={{width: '20%'}}></div></div>
                    </div>
                </>
            )}
        </div>
        <p className="text-xs text-gray-400 mt-4">Payment history and invoice download available for premium members.</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-6 text-center">Upgrade to Unlock More Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map(plan => (
            <PlanCard key={plan.name} {...plan} isCurrent={plan.name === currentUserPlan?.name} />
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 mt-8">
            Secure payments via Razorpay/Stripe. All subscriptions are auto-renewed unless cancelled.
        </p>
      </div>
    </div>
  );
};

export default MembershipView;
