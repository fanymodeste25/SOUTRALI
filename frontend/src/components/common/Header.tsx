import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut, FiGrid } from 'react-icons/fi';
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { UserRole } from '../../types';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b-2 border-primary-100">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo with Gradient */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-md">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <span className="text-2xl font-extrabold text-gradient">Soutrali</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/campaigns" className="text-gray-700 hover:text-primary-600 font-semibold transition-colors relative group">
              Campagnes
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-primary-600 font-semibold transition-colors relative group">
              Comment ça marche
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary-600 font-semibold transition-colors relative group">
              À propos
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-500 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors font-semibold"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-white" />
                  </div>
                  <span>
                    {user?.first_name || 'Compte'}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl py-2 border-2 border-primary-100 animate-slide-up">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 transition-colors font-medium"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <FiUser className="w-4 h-4 text-primary-600" />
                      </div>
                      Profil
                    </Link>
                    {(user?.role === UserRole.ORGANIZER || user?.role === UserRole.ADMIN) && (
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 transition-colors font-medium"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center mr-3">
                          <FiGrid className="w-4 h-4 text-accent-600" />
                        </div>
                        Tableau de bord
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-3 text-coral-600 hover:bg-coral-50 transition-colors font-medium"
                    >
                      <div className="w-8 h-8 bg-coral-100 rounded-full flex items-center justify-center mr-3">
                        <FiLogOut className="w-4 h-4 text-coral-600" />
                      </div>
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 font-semibold transition-colors"
                >
                  Connexion
                </Link>
                <Link to="/register" className="btn-outline">
                  S'inscrire
                </Link>
              </div>
            )}

            <Link
              to="/campaigns/create"
              className="btn-primary"
            >
              Créer une Campagne
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-700 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-primary-50 transition-colors"
          >
            {isMobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-6 pb-4 animate-slide-up">
            <div className="flex flex-col space-y-4 bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-4">
              <Link
                to="/campaigns"
                className="text-gray-700 hover:text-primary-600 font-semibold transition-colors px-4 py-2 rounded-lg hover:bg-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Campagnes
              </Link>
              <Link
                to="/how-it-works"
                className="text-gray-700 hover:text-primary-600 font-semibold transition-colors px-4 py-2 rounded-lg hover:bg-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Comment ça marche
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-primary-600 font-semibold transition-colors px-4 py-2 rounded-lg hover:bg-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                À propos
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-primary-600 font-semibold transition-colors px-4 py-2 rounded-lg hover:bg-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profil
                  </Link>
                  {(user?.role === UserRole.ORGANIZER || user?.role === UserRole.ADMIN) && (
                    <Link
                      to="/dashboard"
                      className="text-gray-700 hover:text-primary-600 font-semibold transition-colors px-4 py-2 rounded-lg hover:bg-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Tableau de bord
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-left text-coral-600 font-semibold px-4 py-2 rounded-lg hover:bg-white transition-colors"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 font-semibold transition-colors px-4 py-2 rounded-lg hover:bg-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="btn-outline inline-block text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    S'inscrire
                  </Link>
                </>
              )}

              <Link
                to="/campaigns/create"
                className="btn-primary inline-block text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Créer une Campagne
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
