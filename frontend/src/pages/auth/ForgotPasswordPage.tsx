import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/common/Layout';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement password reset API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      console.log('Password reset requested for:', email);
      setIsSubmitted(true);
      toast.success('Email de réinitialisation envoyé !');
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-md p-8">
            {!isSubmitted ? (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Mot de passe oublié ?
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Entrez votre adresse email et nous vous enverrons un lien
                    pour réinitialiser votre mot de passe.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Envoi en cours...
                      </>
                    ) : (
                      'Envoyer le lien de réinitialisation'
                    )}
                  </button>
                </form>

                {/* Back to login */}
                <div className="mt-6">
                  <Link
                    to="/login"
                    className="flex items-center justify-center text-sm text-blue-600 hover:text-blue-700"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour à la connexion
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* Success Message */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Email envoyé !
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Nous avons envoyé un lien de réinitialisation à{' '}
                    <strong>{email}</strong>. Vérifiez votre boîte de réception
                    et suivez les instructions.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-700">
                      <strong>Note :</strong> Le lien expirera dans 1 heure.
                      Si vous ne recevez pas l'email, vérifiez votre dossier spam
                      ou réessayez.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Renvoyer l'email
                    </button>
                    <Link
                      to="/login"
                      className="block w-full text-center px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <ArrowLeft className="w-4 h-4 inline mr-2" />
                      Retour à la connexion
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Help Text */}
          {!isSubmitted && (
            <p className="mt-4 text-center text-sm text-gray-600">
              Vous n'avez pas de compte ?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                S'inscrire
              </Link>
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
