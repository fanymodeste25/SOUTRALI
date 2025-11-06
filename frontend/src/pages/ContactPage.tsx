import { useState } from 'react';
import { Layout } from '../components/common/Layout';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement contact form submission API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      toast.success('Message envoyé avec succès ! Nous vous répondrons bientôt.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient-vibrant">Contactez-nous</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Nous sommes là pour vous aider. N'hésitez pas à nous contacter
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            <div className="card-gradient p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FiMail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">contact@soutrali.com</p>
              <p className="text-gray-600">support@soutrali.com</p>
            </div>

            <div className="card-gradient p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FiPhone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Téléphone</h3>
              <p className="text-gray-600">+221 XX XXX XX XX</p>
              <p className="text-gray-600 text-sm">Lun - Ven: 9h - 18h GMT</p>
            </div>

            <div className="card-gradient p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-coral-500 to-coral-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FiMapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Adresse</h3>
              <p className="text-gray-600">Dakar, Sénégal</p>
              <p className="text-gray-600">Afrique de l'Ouest</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card-gradient p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="text-gradient">Envoyez-nous un Message</span>
            </h2>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    required
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                    required
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  Sujet *
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="input-field"
                  required
                  placeholder="Objet de votre message"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input-field min-h-[200px] resize-y"
                  required
                  placeholder="Votre message..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <FiSend className="w-5 h-5" />
                    Envoyer le message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-12 bg-gradient-to-br from-primary-50 to-accent-50 rounded-3xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Besoin d'aide immédiate ?
            </h3>
            <p className="text-gray-600 mb-6">
              Consultez notre centre d'aide pour trouver des réponses rapides à vos questions
            </p>
            <a href="/help" className="btn-primary inline-block">
              Visiter le Centre d'Aide
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};
