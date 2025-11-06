import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/common/Layout';
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Veuillez entrer votre adresse email');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement password reset API call
      console.log('Password reset request for:', email);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setEmailSent(true);
      toast.success('Email de réinitialisation envoyé !');
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-dark-800 to-dark-900 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full">
          {!emailSent ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
                    <FaEnvelope className="text-3xl text-white" />
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Mot de Passe Oublié ?
                </h1>
                <p className="text-gray-400">
                  Pas de problème. Entrez votre adresse email et nous vous enverrons un lien pour
                  réinitialiser votre mot de passe.
                </p>
              </div>

              {/* Form */}
              <div className="bg-dark-700 rounded-xl p-8 border border-dark-600 shadow-xl">
                <form onSubmit={handleSubmit}>
                  {/* Email */}
                  <div className="mb-6">
                    <label className="block text-gray-400 mb-2 text-sm font-medium">
                      Adresse Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-dark-600 text-white border border-dark-500 rounded-lg px-4 py-3 pl-12 focus:border-primary-500 focus:outline-none"
                        placeholder="votre@email.com"
                        required
                      />
                      <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Envoi en cours...</span>
                      </div>
                    ) : (
                      'Envoyer le Lien de Réinitialisation'
                    )}
                  </button>

                  {/* Back to Login */}
                  <Link
                    to="/login"
                    className="flex items-center justify-center space-x-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <FaArrowLeft />
                    <span>Retour à la connexion</span>
                  </Link>
                </form>
              </div>

              {/* Additional Info */}
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Vous n'avez pas encore de compte ?{' '}
                  <Link to="/register" className="text-primary-500 hover:text-primary-400 font-semibold">
                    Inscrivez-vous
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <FaCheckCircle className="text-4xl text-white" />
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Email Envoyé !
                </h1>
                <div className="bg-dark-700 rounded-xl p-8 border border-dark-600 shadow-xl mb-6">
                  <p className="text-gray-400 mb-4">
                    Nous avons envoyé un email à :
                  </p>
                  <p className="text-white font-semibold text-lg mb-4">
                    {email}
                  </p>
                  <p className="text-gray-400">
                    Cliquez sur le lien dans l'email pour réinitialiser votre mot de passe.
                    Si vous ne recevez pas l'email dans quelques minutes, vérifiez votre dossier spam.
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setEmailSent(false);
                      setEmail('');
                    }}
                    className="w-full bg-dark-700 text-white font-bold py-3 rounded-lg hover:bg-dark-600 transition-colors border border-dark-600"
                  >
                    Essayer une Autre Adresse
                  </button>

                  <Link
                    to="/login"
                    className="flex items-center justify-center space-x-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <FaArrowLeft />
                    <span>Retour à la connexion</span>
                  </Link>
                </div>
              </div>
            </>
          )}

          {/* Help */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Besoin d'aide ?{' '}
              <Link to="/help" className="text-primary-500 hover:text-primary-400">
                Contactez le support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
