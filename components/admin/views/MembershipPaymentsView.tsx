import React, { useMemo, useState, useEffect } from 'react';
import Button from '../../ui/Button';
import { CreditCardIcon } from '../../icons/CreditCardIcon';
import { StarIcon } from '../../icons/StarIcon';
import { CheckIcon } from '../../icons/CheckIcon';
import { LockOpenIcon } from '../../icons/LockOpenIcon';
import { XMarkIcon } from '../../icons/XMarkIcon';
import { LoggedInUserSessionData, MembershipTier, Plan, PlanFeature } from '../../../types';
import apiClient from '../../../utils/apiClient';
import { useToast } from '../../../hooks/useToast';
import { Coupon, DiscountType } from '../../../types';
import { TrashIcon } from '../../icons/TrashIcon';
import Input from '../../ui/Input';
import Select from '../../ui/Select';


interface Transaction {
  id: string;
  user: {
    id: string;
    fullName: string;
  } | null;
  plan: string;
  amount: number;
  currency: string;
  paymentId: string;
  createdAt: string;
  status: 'Success' | 'Failed' | 'Pending';
}


const MembershipPaymentsView: React.FC = () => {
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState('');
  const [couponDiscountType, setCouponDiscountType] = useState<DiscountType>(DiscountType.PERCENTAGE);
  const [couponExpiry, setCouponExpiry] = useState('');
  
  const [plans, setPlans] = useState<Plan[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState({ plans: true, transactions: true, coupons: true });
  const { showToast } = useToast();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editablePlanData, setEditablePlanData] = useState<Partial<Plan>>({});

  const fetchPlans = async () => {
    setIsLoading(prev => ({ ...prev, plans: true }));
    try {
      const data = await apiClient('/api/content/plans');
      setPlans(data);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(prev => ({ ...prev, plans: false }));
    }
  };

  const fetchCoupons = async () => {
      setIsLoading(prev => ({...prev, coupons: true}));
      try {
          const data = await apiClient('/api/admin/coupons');
          setCoupons(data);
      } catch (err: any) {
          showToast(err.message, 'error');
      } finally {
          setIsLoading(prev => ({...prev, coupons: false}));
      }
  };
  
  const fetchTransactions = async () => {
      setIsLoading(prev => ({...prev, transactions: true}));
      try {
          const data = await apiClient('/api/admin/transactions');
          setTransactions(data);
      } catch(err: any) {
          showToast(err.message, 'error');
      } finally {
          setIsLoading(prev => ({...prev, transactions: false}));
      }
  };

  useEffect(() => {
    fetchPlans();
    fetchTransactions();
    fetchCoupons();
  }, []);

  const handleOpenEditModal = (plan: Plan) => {
    setEditingPlan(plan);
    setEditablePlanData({
      priceMonthlyDisplay: plan.priceMonthlyDisplay,
      priceMonthly: plan.priceMonthly,
      priceYearlyDisplay: plan.priceYearlyDisplay || '',
      priceYearly: plan.priceYearly || 0,
      features: plan.features.map(f => `${f.text}|${f.included}`).join('\n') as any
    });
    setIsEditModalOpen(true);
  };
  
  const handleUpdatePlan = async () => {
    if (!editingPlan) return;
    try {
      await apiClient(`/api/admin/plans/${editingPlan.id}`, {
        method: 'PUT',
        body: editablePlanData
      });
      showToast('Plan updated successfully!', 'success');
      setIsEditModalOpen(false);
      setEditingPlan(null);
      fetchPlans();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleCreateCoupon = async () => {
    if (!couponCode || !couponDiscount) {
      showToast('Coupon code and discount value are required.', 'error');
      return;
    }
    try {
      await apiClient('/api/admin/coupons', {
        method: 'POST',
        body: {
          code: couponCode,
          discountType: couponDiscountType,
          discountValue: couponDiscount,
          expiryDate: couponExpiry || null
        }
      });
      showToast('Coupon created successfully!', 'success');
      setCouponCode('');
      setCouponDiscount('');
      setCouponExpiry('');
      fetchCoupons();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
      if (window.confirm('Are you sure you want to delete this coupon?')) {
          try {
              await apiClient(`/api/admin/coupons/${couponId}`, { method: 'DELETE' });
              showToast('Coupon deleted.', 'info');
              fetchCoupons();
          } catch (err: any) {
              showToast(err.message, 'error');
          }
      }
  };

  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex items-center space-x-3">
        <CreditCardIcon className="w-8 h-8 text-rose-400" />
        <h1 className="text-3xl font-bold">Membership & Payments</h1>
      </div>

      <div className="bg-gray-700 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Membership Plans</h2>
        {isLoading.plans ? <p className="text-gray-400">Loading plans...</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map(plan => (
                <div key={plan.name} className="bg-gray-650 p-4 rounded-md shadow flex flex-col">
                <h3 className="font-semibold text-lg text-white">{plan.name}</h3>
                <p className="text-rose-400 text-sm">{plan.priceMonthlyDisplay} {plan.priceYearlyDisplay ? ` / ${plan.priceYearlyDisplay}` : ''}</p>
                <ul className="text-xs text-gray-400 mt-1 list-disc list-inside flex-grow">
                    {plan.features.slice(0,2).map((b, i) => <li key={i}>{b.text}</li>)}
                    {plan.features.length > 2 && <li>...and more</li>}
                </ul>
                <Button onClick={() => handleOpenEditModal(plan)} size="sm" variant="secondary" className="!text-xs !py-1 !px-2 mt-3 !bg-blue-600 hover:!bg-blue-700 !text-white self-start">Edit Plan</Button>
                </div>
            ))}
            </div>
        )}
      </div>
      
      <div className="bg-gray-700 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Coupons & Discounts</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <Input id="couponCode" name="couponCode" label="Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="e.g., NAVRATRI20" className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" />
            <Input id="couponDiscount" name="couponDiscount" type="number" label="Discount Value" value={couponDiscount} onChange={(e) => setCouponDiscount(e.target.value)} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" placeholder="e.g. 20 or 100"/>
            <Select id="couponDiscountType" name="couponDiscountType" label="Discount Type" options={[{value: DiscountType.PERCENTAGE, label:'%'}, {value: DiscountType.FIXED, label:'Fixed'}]} value={couponDiscountType} onChange={e => setCouponDiscountType(e.target.value as DiscountType)} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500"/>
            <Input type="date" id="couponExpiry" name="couponExpiry" label="Expiry Date" value={couponExpiry} onChange={(e) => setCouponExpiry(e.target.value)} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white [&_input]:border-gray-500"/>
        </div>
        <Button onClick={handleCreateCoupon} variant="primary" className="!bg-purple-600 hover:!bg-purple-700 mt-3">Create Coupon</Button>
      
        <div className="mt-6 overflow-x-auto">
            <h3 className="text-md font-semibold text-gray-300 mb-2">Existing Coupons</h3>
            <table className="min-w-full divide-y divide-gray-600 text-xs">
                <thead className="bg-gray-750"><tr>{['Code', 'Discount', 'Expires', 'Status', 'Actions'].map(h=><th key={h} className="px-2 py-2 text-left font-medium text-gray-400 uppercase">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-gray-600">
                    {isLoading.coupons ? <tr><td colSpan={5} className="text-center p-3 text-gray-400">Loading...</td></tr> : coupons.map(c => (
                        <tr key={c.id}>
                            <td className="px-2 py-2 font-mono text-white">{c.code}</td>
                            <td className="px-2 py-2">{c.discountValue}{c.discountType === DiscountType.PERCENTAGE ? '%' : ' Fixed'}</td>
                            <td className="px-2 py-2">{c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : 'Never'}</td>
                            <td className="px-2 py-2">{c.status}</td>
                            <td className="px-2 py-2"><Button size="sm" variant="danger" className="!p-1 !text-[10px]" onClick={() => handleDeleteCoupon(c.id)}><TrashIcon className="w-3 h-3"/></Button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      <div className="bg-gray-700 p-6 rounded-lg shadow-xl overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Transaction Logs</h2>
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-750">
            <tr>{['Txn ID', 'User', 'Plan', 'Amount', 'Date', 'Status'].map(header => (<th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{header}</th>))}</tr>
          </thead>
          <tbody className="bg-gray-700 divide-y divide-gray-600">
            {isLoading.transactions ? (
                <tr><td colSpan={6} className="text-center py-4 text-gray-400">Loading transactions...</td></tr>
            ) : transactions.length > 0 ? transactions.map(txn => (
              <tr key={txn.id}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400" title={txn.paymentId}>{txn.id.slice(-8)}...</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-white">{txn.user?.fullName || 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{txn.plan}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-green-400">{txn.currency} {txn.amount}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{new Date(txn.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    txn.status === 'Success' ? 'bg-green-700 text-green-100' :
                    txn.status === 'Failed' ? 'bg-red-700 text-red-100' :
                    'bg-yellow-700 text-yellow-100'
                  }`}>
                    {txn.status}
                  </span>
                </td>
              </tr>
            )) : (
                <tr><td colSpan={6} className="text-center py-4 text-gray-400">No transactions to display.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
      {isEditModalOpen && editingPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg text-gray-100 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-2">
                    <h3 className="text-xl font-semibold">Edit Plan: {editingPlan.name}</h3>
                    <Button type="button" onClick={() => setIsEditModalOpen(false)} variant="secondary" size="sm" className="!p-1.5 !rounded-full !bg-gray-700"><XMarkIcon className="w-4 h-4"/></Button>
                </div>
                <div className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {/* FIX: Added missing 'id' prop to Input component. */}
                    <Input id="edit-priceMonthlyDisplay" label="Price Monthly Display (e.g., ₹499 / month)" name="priceMonthlyDisplay" value={editablePlanData.priceMonthlyDisplay || ''} onChange={e => setEditablePlanData(p => ({...p, priceMonthlyDisplay: e.target.value}))} className="[&_label]:text-gray-400 [&_input]:bg-gray-700" />
                    {/* FIX: Added missing 'id' prop to Input component. */}
                    <Input id="edit-priceMonthly" type="number" label="Price Monthly (e.g., 499)" name="priceMonthly" value={String(editablePlanData.priceMonthly || 0)} onChange={e => setEditablePlanData(p => ({...p, priceMonthly: Number(e.target.value)}))} className="[&_label]:text-gray-400 [&_input]:bg-gray-700" />
                    {/* FIX: Added missing 'id' prop to Input component. */}
                    <Input id="edit-priceYearlyDisplay" label="Price Yearly Display (e.g., or ₹4999 / year)" name="priceYearlyDisplay" value={editablePlanData.priceYearlyDisplay || ''} onChange={e => setEditablePlanData(p => ({...p, priceYearlyDisplay: e.target.value}))} className="[&_label]:text-gray-400 [&_input]:bg-gray-700" />
                    {/* FIX: Added missing 'id' prop to Input component. */}
                    <Input id="edit-priceYearly" type="number" label="Price Yearly (e.g., 4999)" name="priceYearly" value={String(editablePlanData.priceYearly || 0)} onChange={e => setEditablePlanData(p => ({...p, priceYearly: Number(e.target.value)}))} className="[&_label]:text-gray-400 [&_input]:bg-gray-700" />
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Features (format: text|true/false)</label>
                        <textarea rows={8} name="features" value={editablePlanData.features as any || ''} onChange={e => setEditablePlanData(p => ({...p, features: e.target.value as any}))} className="w-full bg-gray-700 p-2 rounded border border-gray-600 text-sm font-mono custom-scrollbar" />
                    </div>
                </div>
                 <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-600">
                    <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                    <Button type="button" variant="primary" onClick={handleUpdatePlan} className="!bg-rose-500">Save Changes</Button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default MembershipPaymentsView;