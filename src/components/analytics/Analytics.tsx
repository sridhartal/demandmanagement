import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Download, Filter } from 'lucide-react';

export function Analytics() {
  const [timeRange, setTimeRange] = useState('3months');
  const [department, setDepartment] = useState('all');

  // Mock analytics data
  const metrics = {
    totalPlans: 24,
    totalPositions: 142,
    avgApprovalTime: 2.3,
    totalBudget: 18500000,
    approvalRate: 78,
    timeToFill: 45
  };

  const monthlyData = [
    { month: 'Oct', plans: 8, positions: 45, approved: 6 },
    { month: 'Nov', plans: 12, positions: 67, approved: 9 },
    { month: 'Dec', plans: 15, positions: 89, approved: 12 },
    { month: 'Jan', plans: 18, positions: 102, approved: 14 }
  ];

  const departmentData = [
    { name: 'Engineering', positions: 65, budget: 8500000, plans: 12 },
    { name: 'Product', positions: 28, budget: 3200000, plans: 6 },
    { name: 'Design', positions: 18, budget: 2100000, plans: 4 },
    { name: 'Data Science', positions: 22, budget: 3400000, plans: 5 },
    { name: 'DevOps', positions: 9, budget: 1300000, plans: 3 }
  ];

  const positionCategories = [
    { category: 'Software Engineer', count: 35, percentage: 25 },
    { category: 'Senior Software Engineer', count: 28, percentage: 20 },
    { category: 'Product Manager', count: 18, percentage: 13 },
    { category: 'UI/UX Designer', count: 15, percentage: 11 },
    { category: 'Data Scientist', count: 12, percentage: 8 },
    { category: 'DevOps Engineer', count: 10, percentage: 7 },
    { category: 'Others', count: 24, percentage: 16 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Hiring metrics and demand planning insights</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Departments</option>
            <option value="engineering">Engineering</option>
            <option value="product">Product</option>
            <option value="design">Design</option>
            <option value="data">Data Science</option>
          </select>
          
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Plans</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalPlans}</p>
              <p className="text-xs text-green-600 mt-1">+12% vs last period</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Positions</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalPositions}</p>
              <p className="text-xs text-green-600 mt-1">+25% vs last period</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Avg Approval Time</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.avgApprovalTime}d</p>
              <p className="text-xs text-green-600 mt-1">-15% vs last period</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(metrics.totalBudget / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-blue-600 mt-1">+8% vs last period</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Approval Rate</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.approvalRate}%</p>
              <p className="text-xs text-green-600 mt-1">+5% vs last period</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Avg Time to Fill</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.timeToFill}d</p>
              <p className="text-xs text-red-600 mt-1">+3% vs last period</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Trends</h3>
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-gray-600">{data.month}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="w-32">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Plans</span>
                          <span>{data.plans}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(data.plans / 20) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-32">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Positions</span>
                          <span>{data.positions}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(data.positions / 120) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Department Breakdown</h3>
          <div className="space-y-4">
            {departmentData.map((dept, index) => (
              <div key={dept.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-purple-500' :
                    index === 3 ? 'bg-amber-500' : 'bg-red-500'
                  }`}></div>
                  <span className="font-medium text-gray-900">{dept.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{dept.positions} positions</p>
                  <p className="text-xs text-gray-600">${(dept.budget / 1000000).toFixed(1)}M budget</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Position Categories */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Position Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {positionCategories.map((category, index) => (
            <div key={category.category} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm">{category.category}</h4>
                <span className="text-xs text-gray-600">{category.percentage}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{category.count}</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${category.percentage * 4}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New demand plan created', user: 'John Doe', time: '2 hours ago', type: 'create' },
            { action: 'Demand plan approved', user: 'Sarah Smith', time: '4 hours ago', type: 'approve' },
            { action: 'Bulk upload completed', user: 'Mike Johnson', time: '6 hours ago', type: 'upload' },
            { action: 'AI-generated plan reviewed', user: 'Lisa Wong', time: '8 hours ago', type: 'ai' },
            { action: 'Budget adjustment made', user: 'David Kim', time: '1 day ago', type: 'edit' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 py-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.type === 'create' ? 'bg-blue-100' :
                activity.type === 'approve' ? 'bg-green-100' :
                activity.type === 'upload' ? 'bg-amber-100' :
                activity.type === 'ai' ? 'bg-purple-100' :
                'bg-gray-100'
              }`}>
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === 'create' ? 'bg-blue-600' :
                  activity.type === 'approve' ? 'bg-green-600' :
                  activity.type === 'upload' ? 'bg-amber-600' :
                  activity.type === 'ai' ? 'bg-purple-600' :
                  'bg-gray-600'
                }`}></div>
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium text-sm">{activity.action}</p>
                <p className="text-gray-600 text-xs">by {activity.user} • {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}