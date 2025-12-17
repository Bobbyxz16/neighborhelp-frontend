import React from 'react';
import Icon from './AppIcon';
import Button from './ui-components/Button';

const ReportModal = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
    reportForm,
    setReportForm,
    title = "Report Issue",
    description = "Help us maintain quality by reporting issues. Your report will be reviewed by our team.",
    targetType = 'RESOURCE' // 'RESOURCE' or 'COMMENT'
}) => {
    if (!isOpen) return null;

    // Resource report types
    const resourceReportTypes = [
        { value: 'INAPPROPRIATE_CONTENT', label: 'Inappropriate Content' },
        { value: 'SPAM_CONTENT', label: 'Spam' },
        { value: 'FRAUD', label: 'Fraud or Scam' },
        { value: 'INACCURATE_INFORMATION', label: 'Inaccurate Information' },
        { value: 'OUTDATED_INFORMATION', label: 'Outdated Information' },
        { value: 'PRIVACY_VIOLATION', label: 'Privacy Violation' },
        { value: 'DISCRIMINATION', label: 'Discrimination' },
        { value: 'OTHER', label: 'Other' }
    ];

    // Comment report types
    const commentReportTypes = [
        { value: 'HARASSMENT', label: 'Harassment' },
        { value: 'HATE_SPEECH', label: 'Hate Speech' },
        { value: 'OFFENSIVE_CONTENT', label: 'Offensive Content' },
        { value: 'MISLEADING_INFO', label: 'Misleading Information' },
        { value: 'PERSONAL_ATTACK', label: 'Personal Attack' },
        { value: 'DISCRIMINATION', label: 'Discrimination' },
        { value: 'SPAM_CONTENT', label: 'Spam' },
        { value: 'OTHER', label: 'Other' }
    ];

    // Select options based on targetType
    const reportTypes = targetType === 'COMMENT' ? commentReportTypes : resourceReportTypes;

    const severityOptions = [
        { value: 'LOW', label: 'Low', color: 'bg-green-100 text-green-700' },
        { value: 'MEDIUM', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
        { value: 'HIGH', label: 'High', color: 'bg-red-100 text-red-700' }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <Icon name="X" size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <p className="text-sm text-gray-600">
                        {description}
                    </p>

                    {/* Report Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Report Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={reportForm.reportType}
                            onChange={(e) => setReportForm(prev => ({ ...prev, reportType: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                            <option value="">Select a reason...</option>
                            {reportTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Severity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Severity Level
                        </label>
                        <div className="flex gap-3">
                            {severityOptions.map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => setReportForm(prev => ({ ...prev, severity: option.value }))}
                                    className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all duration-200 ${reportForm.severity === option.value
                                        ? `${option.color} border-current font-medium shadow-sm`
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={reportForm.description}
                            onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Please describe the issue in detail..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            rows="4"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Provide as much detail as possible to help us investigate.
                        </p>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onSubmit}
                        disabled={!reportForm.reportType || !reportForm.description.trim() || isSubmitting}
                        className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
