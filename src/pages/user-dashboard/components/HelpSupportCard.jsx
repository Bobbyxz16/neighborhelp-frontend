import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/ui-components/Button';

const HelpSupportCard = () => {
    return (
        <div className="bg-card rounded-xl border border-border p-6 h-full">
            <h3 className="text-lg font-semibold text-foreground mb-4">Need Help?</h3>
            <div className="space-y-3">
                <Link to="/user-dashboard/faq">
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        iconName="HelpCircle"
                        iconPosition="left"
                    >
                        Frequently Asked Questions
                    </Button>
                </Link>
                <Link to="/user-dashboard/contact-support">
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        iconName="MessageCircle"
                        iconPosition="left"
                    >
                        Contact Support
                    </Button>
                </Link>
                <Link to="/user-dashboard/user-guide">
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        iconName="Book"
                        iconPosition="left"
                    >
                        User Guide
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default HelpSupportCard;
