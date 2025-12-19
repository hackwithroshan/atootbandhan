import React, { useState } from 'react';
import { CreditCardIcon } from '../../icons/CreditCardIcon';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';

const MembershipPaymentsView: React.FC = () => {
  const [gstNumber, setGstNumber] = useState('27ABCDE1234F1Z5'); // Mock GST
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState('');
  const [couponExpiry, setCouponExpiry] = useState('');
  const [manualPaymentTxnId, setManualPaymentTxnId] = useState('');
  
  const [plans, setPlans] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);


  const paymentMethodOptions = [{value:'', label:'Any Method'}, {value:'Credit Card', label:'Credit Card'}, {value:'UPI', label:'UPI'}, {value:'Net Banking', label:'Net Banking'}, {value:'Offline/Bank', label:'Offline/Bank'}];
  const planFilterOptions = [{value:'', label:'Any Plan'}, ...plans.map(p => ({value: p.id, label: p.name}))];


  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex items-center space-x-3">
        <CreditCardIcon className="w-8 h-8 text-rose-400" />
        <h1 className="text-3xl font-bold">Membership & Payments</h1>
      </div>
      <p className="text-gray-300">
        Manage membership plans (monthly/quarterly/yearly, benefits), pricing tiers, view transaction logs, handle offline payments, manage coupons, and generate invoices.
      </p>

      {/* Membership Plans Overview */}
      <div className="bg-gray-700 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Membership Plans</h2>
        {plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map(plan => (
            <div key={plan.id} className="bg-gray-650 p-4 rounded-md shadow flex flex-col">
              <h3 className="font-semibold text-lg text-white">{plan.name}</h3>
              <p className="text-rose-400 text-sm">{plan.priceMonthly} / {plan.priceYearly !== 'N/A' ? plan.priceYearly : ''}</p>
              <p className="text-xs text-gray-300">{plan.users} Users</p>
              <ul className="text-xs text-gray-400 mt-1 list-disc list-inside flex-grow">
                  {plan.benefits.slice(0,2).map((b: any) => <li key={b}>{b}</li>)}
                  {plan.benefits.length > 2 && <li>...and more</li>}
              </ul>
              <Button onClick={() => alert(`Editing plan: ${plan.name}. UI for benefits per plan will appear here.`)} size="sm" variant="secondary" className="!text-xs !py-1 !px-2 mt-3 !bg-blue-600 hover:!bg-blue-700 !text-white self-start">Edit Plan/Benefits</Button>
            </div>
          ))}
        </div>
        ) : ( <p className="text-gray-400">Loading plans or no plans found...</p> )}
        <Button variant="primary" onClick={() => alert("Add new plan form would appear here.")} className="!bg-green-600 hover:!bg-green-700 mt-4">Add New Plan</Button>
        <Button variant="secondary" onClick={() => alert("Delete plan UI would appear here.")} className="!bg-red-600 hover:!bg-red-700 mt-4 ml-2">Delete Plan (Mock)</Button>
      </div>
      
      {/* Coupons / Referral Discounts */}
      <div className="bg-gray-700 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Coupons & Referral Discounts Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Input id="couponCode" name="couponCode" label="Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" placeholder="e.g. NAVRATRI20"/>
            <Input id="couponDiscount" name="couponDiscount" label="Discount (%, or fixed amount)" value={couponDiscount} onChange={(e) => setCouponDiscount(e.target.value)} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" placeholder="e.g. 20% or 100"/>
            <Input type="date" id="couponExpiry" name="couponExpiry" label="Expiry Date" value={couponExpiry} onChange={(e) => setCouponExpiry(e.target.value)} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white [&_input]:border-gray-500"/>
        </div>
        <Button onClick={() => alert(`Coupon ${couponCode} created (mock).`)} variant="primary" className="!bg-purple-600 hover:!bg-purple-700 mt-3">Create Coupon</Button>
        <p className="text-xs text-gray-400 mt-2">List of active/expired coupons and referral discount settings will be displayed here.</p>
      </div>

      {/* Manual Payment Approvals */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Manual Payment Approvals (UPI/Offline/Bank)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <Input id="manualPaymentTxnId" name="manualPaymentTxnId" label="Transaction ID / Reference" value={manualPaymentTxnId} onChange={(e) => setManualPaymentTxnId(e.target.value)} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" placeholder="Enter Txn ID"/>
                <Button onClick={() => alert(`Marking Txn ID ${manualPaymentTxnId} as paid (mock).`)} variant="primary" className="!bg-teal-600 hover:!bg-teal-700 h-10">Mark as Paid</Button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Table of pending manual payments would appear here.</p>
        </div>


      {/* Transaction Logs */}
      <div className="bg-gray-700 p-6 rounded-lg shadow-xl overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h2 className="text-xl font-semibold text-gray-100">Transaction Logs</h2>
            <Button variant="secondary" onClick={() => alert("Exporting transactions (mock).")} className="!bg-rose-500 hover:!bg-rose-600 !text-white self-start sm:self-center">Export Transactions (CSV/PDF)</Button>
        </div>
        {/* Filters for Transactions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4 items-end">
            <Input id="txnLocationFilter" name="txnLocationFilter" label="Location (City)" placeholder="Filter by city" className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white"/>
            <Select id="txnPlanFilter" name="txnPlanFilter" label="Plan" options={planFilterOptions} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500"/>
            <Select id="txnPaymentMethodFilter" name="txnPaymentMethodFilter" label="Payment Method" options={paymentMethodOptions} className="[&_label]:text-gray-400 [&_select]:bg-gray-600 [&_select]:text-white [&_select]:border-gray-500"/>
        </div>
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-750">
            <tr>
              {['Txn ID', 'User ID', 'Plan', 'Amount', 'Date', 'Method', 'Status', 'User Type', 'Actions'].map(header => (
                <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-700 divide-y divide-gray-600">
            {transactions.length > 0 ? transactions.map(txn => (
              <tr key={txn.id} className="hover:bg-gray-650 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{txn.id}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-white">{txn.userId}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{txn.plan}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{txn.amount}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{txn.date}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{txn.paymentMethod}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    txn.status === 'Success' ? 'bg-green-700 text-green-100' : txn.status === 'Pending Approval' ? 'bg-yellow-700 text-yellow-100' : 'bg-red-700 text-red-100'
                  }`}>
                    {txn.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{txn.userType}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <Button onClick={() => alert(`Viewing invoice for ${txn.id}`)} size="sm" variant="secondary" className="!text-xs !py-1 !px-2 !bg-blue-600 hover:!bg-blue-700 !text-white">View Invoice</Button>
                </td>
              </tr>
            )) : (
                <tr><td colSpan={9} className="text-center py-4 text-gray-400">No transactions to display.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Tax & Invoice Management (GST part) */}
      <div className="bg-gray-700 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Tax & Invoice Settings (GST/Invoice Generator)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <Input id="gstNumber" name="gstNumber" label="Business GST Number" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} className="[&_label]:text-gray-400 [&_input]:bg-gray-600 [&_input]:text-white" placeholder="Enter GSTIN"/>
            <Button onClick={() => alert("GST settings saved (mock). Invoice generation will use this.")} variant="secondary" className="!bg-blue-600 hover:!bg-blue-700 !text-white h-10">Save GST Details</Button>
        </div>
        <p className="text-xs text-gray-400 mt-3">Mock functionality for auto-generating GST bills. B2C/B2B categorization for users is planned.</p>
      </div>
    </div>
  );
};

export default MembershipPaymentsView;