import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '../../components/common/Layout';
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';

type PaymentStatus = 'verifying' | 'success' | 'failed' | 'pending';

export function PaymentVerifyPage() {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>('verifying');
  const [paymentDetails, setPaymentDetails] = useState({
    amount: 0,
    campaignTitle: '',
    campaignId: '',
    transactionId: transactionId || '',
  });

  useEffect(() => {
    // Simulate payment verification API call
    const verifyPayment = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock response
        setPaymentDetails({
          amount: 10000,
          campaignTitle: 'Construction d\'une école',
          campaignId: '123',
          transactionId: transactionId || '',
        });

        // Simulate random status for demo
        const statuses: PaymentStatus[] = ['success', 'failed', 'pending'];
        setStatus(statuses[0]); // Always success for demo
      } catch (error) {
        setStatus('failed');
      }
    };

    if (transactionId) {
      verifyPayment();
    } else {
      setStatus('failed');
    }
  }, [transactionId]);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-6">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Vérification du paiement...
            </h1>
            <p className="text-gray-600 mb-4">
              Veuillez patienter pendant que nous vérifions votre transaction.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 inline-block">
              <p className="text-sm text-gray-700">
                Transaction ID: <strong>{transactionId}</strong>
              </p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Paiement réussi !
            </h1>
            <p className="text-gray-600 mb-6">
              Merci pour votre générosité ! Votre don a été enregistré avec succès.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Détails de la transaction
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant:</span>
                  <span className="font-semibold text-gray-900">
                    {paymentDetails.amount.toLocaleString()} FCFA
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Campagne:</span>
                  <span className="font-semibold text-gray-900">
                    {paymentDetails.campaignTitle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-sm text-gray-900">
                    {paymentDetails.transactionId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="text-gray-900">
                    {new Date().toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                Un email de confirmation vous a été envoyé avec les détails de votre don.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={`/campaigns/${paymentDetails.campaignId}`}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Voir la campagne
              </Link>
              <Link
                to="/campaigns"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Découvrir d'autres campagnes
              </Link>
            </div>
          </div>
        );

      case 'pending':
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 mb-6">
              <Loader2 className="w-10 h-10 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Paiement en attente
            </h1>
            <p className="text-gray-600 mb-6">
              Votre paiement est en cours de traitement. Cela peut prendre quelques minutes.
            </p>

            <div className="bg-yellow-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                Vous recevrez un email de confirmation dès que le paiement sera validé.
                Vous pouvez fermer cette page en toute sécurité.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Vérifier à nouveau
              </button>
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        );

      case 'failed':
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Échec du paiement
            </h1>
            <p className="text-gray-600 mb-6">
              Nous n'avons pas pu vérifier votre paiement. Cela peut être dû à plusieurs raisons.
            </p>

            <div className="bg-red-50 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
              <h3 className="font-semibold text-gray-900 mb-2">
                Causes possibles :
              </h3>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>Fonds insuffisants</li>
                <li>Transaction annulée</li>
                <li>Problème de connexion</li>
                <li>Informations de paiement incorrectes</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Réessayer le paiement
              </button>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Contacter le support
              </Link>
            </div>

            <Link
              to="/"
              className="inline-flex items-center justify-center mt-4 text-sm text-gray-600 hover:text-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Link>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-lg shadow-md p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </Layout>
  );
}
