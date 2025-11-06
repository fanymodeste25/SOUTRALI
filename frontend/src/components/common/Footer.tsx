import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiTwitter, FiFacebook, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { AfricaMapOutline } from './AfricaMap';

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 african-pattern opacity-10"></div>

      {/* Africa Maps Decoration */}
      <div className="absolute top-10 right-10 w-64 h-64 opacity-5">
        <AfricaMapOutline className="w-full h-full" strokeColor="white" animated />
      </div>
      <div className="absolute bottom-10 left-10 w-48 h-48 opacity-5">
        <AfricaMapOutline className="w-full h-full" strokeColor="white" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">S</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Soutrali</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-gradient">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/campaigns" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 group-hover:w-3 transition-all"></span>
                  {t('footer.browseCampaigns')}
                </Link>
              </li>
              <li>
                <Link to="/campaigns/create" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 group-hover:w-3 transition-all"></span>
                  {t('footer.createCampaign')}
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 group-hover:w-3 transition-all"></span>
                  {t('footer.howItWorks')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 group-hover:w-3 transition-all"></span>
                  {t('footer.about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-gradient">{t('footer.support')}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-gray-400 hover:text-accent-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-accent-500 rounded-full mr-2 group-hover:w-3 transition-all"></span>
                  {t('footer.helpCenter')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-accent-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-accent-500 rounded-full mr-2 group-hover:w-3 transition-all"></span>
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-accent-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-accent-500 rounded-full mr-2 group-hover:w-3 transition-all"></span>
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-accent-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-accent-500 rounded-full mr-2 group-hover:w-3 transition-all"></span>
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-gradient">{t('footer.followUs')}</h3>
            <div className="flex space-x-3 mb-8">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 rounded-lg flex items-center justify-center transition-all transform hover:scale-110 hover:-translate-y-1 shadow-md"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-accent-600 to-accent-500 hover:from-accent-500 hover:to-accent-400 rounded-lg flex items-center justify-center transition-all transform hover:scale-110 hover:-translate-y-1 shadow-md"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-coral-600 to-coral-500 hover:from-coral-500 hover:to-coral-400 rounded-lg flex items-center justify-center transition-all transform hover:scale-110 hover:-translate-y-1 shadow-md"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-lg flex items-center justify-center transition-all transform hover:scale-110 hover:-translate-y-1 shadow-md"
              >
                <FiLinkedin className="w-5 h-5" />
              </a>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-3 font-semibold">{t('footer.paymentMethods')}</p>
              <div className="flex flex-wrap gap-2">
                <div className="badge-primary">Wave</div>
                <div className="badge-accent">Orange Money</div>
                <div className="badge-coral">MTN Mobile Money</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-gradient-to-r from-primary-500 via-accent-500 to-coral-500 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} <span className="font-bold text-white">Soutrali</span>. {t('footer.copyright')}{' '}
            <span className="text-coral-500">❤</span> {t('footer.forAfrica')}
          </p>
        </div>
      </div>
    </footer>
  );
};
