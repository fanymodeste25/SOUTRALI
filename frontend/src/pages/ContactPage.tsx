import { useState } from 'react';
import { Layout } from '../components/common/Layout';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import toast from 'react-hot-toast';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement contact form submission API call
    console.log('Contact form:', formData);

    // Simulate API call
    setTimeout(() => {
      toast.success('Message envoyé avec succès ! Nous vous répondrons bientôt.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-dark-800 to-dark-900 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Contactez-Nous
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Vous avez une question, un commentaire ou besoin d'aide ? Notre équipe est là pour vous.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            <div className="bg-dark-700 rounded-xl p-6 border border-dark-600 text-center hover:border-primary-500 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center">
                  <FaEnvelope className="text-2xl text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Email</h3>
              <p className="text-gray-400 mb-2">Envoyez-nous un email</p>
              <a
                href="mailto:support@soutrali.com"
                className="text-primary-500 hover:text-primary-400 font-semibold"
              >
                support@soutrali.com
              </a>
            </div>

            <div className="bg-dark-700 rounded-xl p-6 border border-dark-600 text-center hover:border-primary-500 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center">
                  <FaPhone className="text-2xl text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Téléphone</h3>
              <p className="text-gray-400 mb-2">Lun - Ven, 9h - 18h</p>
              <a
                href="tel:+2376XXXXXXXX"
                className="text-primary-500 hover:text-primary-400 font-semibold"
              >
                +237 6XX XX XX XX
              </a>
            </div>

            <div className="bg-dark-700 rounded-xl p-6 border border-dark-600 text-center hover:border-primary-500 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center">
                  <FaMapMarkerAlt className="text-2xl text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Adresse</h3>
              <p className="text-gray-400">
                Yaoundé, Cameroun<br />
                Afrique Centrale
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-dark-700 rounded-xl p-8 md:p-12 border border-dark-600">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Envoyez-nous un Message
            </h2>

            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Name */}
                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium">
                    Nom Complet *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-dark-600 text-white border border-dark-500 rounded-lg px-4 py-3 focus:border-primary-500 focus:outline-none"
                    placeholder="Votre nom"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-dark-600 text-white border border-dark-500 rounded-lg px-4 py-3 focus:border-primary-500 focus:outline-none"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="mb-6">
                <label className="block text-gray-400 mb-2 text-sm font-medium">
                  Sujet *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark-600 text-white border border-dark-500 rounded-lg px-4 py-3 focus:border-primary-500 focus:outline-none"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="support">Support Technique</option>
                  <option value="campaign">Question sur une Campagne</option>
                  <option value="payment">Problème de Paiement</option>
                  <option value="partnership">Partenariat</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              {/* Message */}
              <div className="mb-8">
                <label className="block text-gray-400 mb-2 text-sm font-medium">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full bg-dark-600 text-white border border-dark-500 rounded-lg px-4 py-3 focus:border-primary-500 focus:outline-none resize-none"
                  placeholder="Décrivez votre demande en détail..."
                />
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      <span>Envoyer le Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-400">
              Vous pouvez aussi consulter notre{' '}
              <a href="/help" className="text-primary-500 hover:text-primary-400 font-semibold">
                Centre d'Aide
              </a>
              {' '}pour des réponses immédiates à vos questions.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
