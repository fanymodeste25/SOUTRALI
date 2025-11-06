import { useState } from 'react';
import { Layout } from '../../components/common/Layout';
import { useAuthStore } from '../../stores/authStore';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave } from 'react-icons/fa';

export const ProfilePage = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    address: '', // Not in User type, but can be added later
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update API call
    console.log('Profile update:', formData);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-dark-800 to-dark-900 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Accès Refusé</h1>
            <p className="text-gray-400 mb-8">Vous devez être connecté pour voir cette page.</p>
            <a
              href="/login"
              className="inline-block bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Se Connecter
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-dark-800 to-dark-900 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-accent-500 rounded-full flex items-center justify-center shadow-2xl">
                <FaUser className="text-4xl text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Mon Profil</h1>
            <p className="text-gray-400">Gérez vos informations personnelles</p>
          </div>

          {/* Profile Card */}
          <div className="bg-dark-700 rounded-xl p-8 border border-dark-600 mb-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Informations Personnelles</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <FaEdit />
                  <span>Modifier</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium">
                    Prénom
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full bg-dark-600 text-white border border-dark-500 rounded-lg px-4 py-3 pl-12 focus:border-primary-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium">
                    Nom
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full bg-dark-600 text-white border border-dark-500 rounded-lg px-4 py-3 pl-12 focus:border-primary-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full bg-dark-600 text-white border border-dark-500 rounded-lg px-4 py-3 pl-12 focus:border-primary-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium">
                    Téléphone
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full bg-dark-600 text-white border border-dark-500 rounded-lg px-4 py-3 pl-12 focus:border-primary-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-2 text-sm font-medium">
                    Adresse
                  </label>
                  <div className="relative">
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full bg-dark-600 text-white border border-dark-500 rounded-lg px-4 py-3 pl-12 focus:border-primary-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                    />
                    <FaMapMarkerAlt className="absolute left-4 top-4 text-gray-500" />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <FaSave />
                    <span>Enregistrer les Modifications</span>
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Account Info */}
          <div className="bg-dark-700 rounded-xl p-8 border border-dark-600">
            <h2 className="text-2xl font-bold text-white mb-6">Informations du Compte</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-dark-600">
                <span className="text-gray-400">Rôle</span>
                <span className="text-white font-semibold capitalize">{user.role}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-dark-600">
                <span className="text-gray-400">Statut</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-semibold">
                  Actif
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-400">Membre depuis</span>
                <span className="text-white font-semibold">
                  {new Date(user.created_at || Date.now()).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
