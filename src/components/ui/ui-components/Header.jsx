import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import logoImage from '../../../assets/neighbourlyunion_Image-Photoroom.png';

const Header = ({ user = null, onLogout = () => { } }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location?.pathname === path;
  const isLoginPage = location?.pathname === '/login';

  // Prioritize role for Admin check
  const role = (user?.role || '').toString().toUpperCase();
  const type = (user?.type || user?.userType || '').toString().toUpperCase();

  const isAdmin = role === 'ADMIN';
  const isModerator = role === 'MODERATOR';
  const isProviderAccount = type === 'ORGANIZATION' || type === 'PROVIDER';

  const navigationItems = [
    {
      label: isAdmin ? 'Admin Panel' : isModerator ? 'Moderator Panel' : 'Dashboard',
      path: isAdmin ? '/admin-panel' : isModerator ? '/moderator-panel' : (isProviderAccount ? '/provider-dashboard' : '/user-dashboard'),
      icon: isAdmin ? 'Shield' : isModerator ? 'Eye' : 'LayoutDashboard',
      description: isAdmin ? 'Manage system and resources' : isModerator ? 'Moderate resources and reports' : 'Manage your account and activities'
    },
    ...(isProviderAccount ? [{
      label: 'Create Listing',
      path: '/create-resource',
      icon: 'Plus',
      description: 'Add new resource to help community'
    }] : [])
  ].filter(item => !isLoginPage || (item.label !== 'Dashboard' && item.label !== 'Admin Panel'));

  const Logo = () => (
    <Link to="/" className="flex items-center space-x-2 group">
      <img
        src={logoImage}
        alt="NeighborlyUnion"
        className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
      />
      <span className="text-xl font-heading font-semibold text-foreground">
        NeighborlyUnion
      </span>
    </Link>
  );

  const UserTypeIndicator = () => {
    if (!user) return null;

    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 bg-accent rounded-md">
        <Icon
          name={user?.type === 'provider' ? 'Building2' : 'User'}
          size={16}
          color="var(--color-accent-foreground)"
        />
        <span className="text-sm font-medium text-accent-foreground capitalize">
          {user?.type || 'User'}
        </span>
      </div>
    );
  };

  const NotificationIndicator = () => {
    if (!user) return null;

    const notificationCount = user?.notifications || 0;

    return (
      <button className="relative p-2 text-muted-foreground hover:text-foreground transition-smooth">
        <Icon name="Bell" size={20} />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {notificationCount > 9 ? '9+' : notificationCount}
          </span>
        )}
      </button>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-elevation-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${isActive(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                title={item?.description}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {(isAdmin || isModerator) && (
              <Button
                variant="outline"
                size="sm"
                iconName="Search"
                iconPosition="left"
                onClick={() => navigate('/resources')}
              >
                Find Resources
              </Button>
            )}
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Desktop User Info & Actions */}
                <div className="hidden md:flex items-center space-x-3">
                  <UserTypeIndicator />

                  {/* User Menu */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onLogout}
                      iconName="LogOut"
                      iconPosition="left"
                      iconSize={16}
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  asChild
                >
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-smooth"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border shadow-elevation-2 animate-slide-in">
          <div className="px-4 py-4 space-y-2">
            {/* Mobile Navigation Items */}
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-smooth ${isActive(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent'
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon name={item?.icon} size={20} />
                <div>
                  <div className="font-medium">{item?.label}</div>
                  <div className="text-xs opacity-75">{item?.description}</div>
                </div>
              </Link>
            ))}

            {/* Mobile Auth Actions */}
            {!user ? (
              <div className="pt-4 border-t border-border space-y-2">
                <Link
                  to="/login"
                  className="flex items-center justify-center w-full px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-smooth"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg transition-smooth"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="pt-4 border-t border-border space-y-3">
                <div className="px-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Signed in as:</span>
                  <UserTypeIndicator />
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center space-x-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-smooth"
                >
                  <Icon name="LogOut" size={20} />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;