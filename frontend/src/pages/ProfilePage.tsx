import { useState } from 'react';
import { Layout } from '../components/common/Layout';
import { useAuthStore } from '../stores/authStore';
import { FiUser, FiMail, FiPhone, FiShield, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { UserRole, KYCStatus } from '../types';

export const ProfilePage = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone_number: user?.phone_number || '',
  });

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-600 text-lg">Veuillez vous connecter pour voir votre profil.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update API call
    setIsEditing(false);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrateur';
      case UserRole.ORGANIZER:
        return 'Organisateur';
      case UserRole.DONOR:
        return 'Donateur';
      default:
        return role;
    }
  };

  const getKYCStatusLabel = (status: string) => {
    switch (status) {
      case KYCStatus.NOT_SUBMITTED:
        return 'Non soumis';
      case KYCStatus.PENDING:
        return 'En attente';
      case KYCStatus.APPROVED:
        return 'Approuvé';
      case KYCStatus.REJECTED:
        return 'Rejeté';
      default:
        return status;
    }
  };

  const getKYCStatusColor = (status: string) => {
    switch (status) {
      case KYCStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case KYCStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case KYCStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient-vibrant">Mon Profil</span>
            </h1>
            <p className="text-xl text-gray-600">
              Gérez vos informations personnelles
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="card-gradient p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Informations Personnelles</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
                >
                  <FiEdit2 className="w-5 h-5" />
                  Modifier
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-700 font-semibold"
                >
                  <FiX className="w-5 h-5" />
                  Annuler
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    className="input-field"
                    placeholder="+221 XX XXX XX XX"
                  />
                </div>
                <button type="submit" className="btn-primary">
                  <FiSave className="w-5 h-5" />
                  Enregistrer les modifications
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FiUser className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-1">Nom complet</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {user.first_name} {user.last_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FiMail className="w-6 h-6 text-accent-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-1">Email</p>
                      <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-coral-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FiPhone className="w-6 h-6 text-coral-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-1">Téléphone</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {user.phone_number || 'Non renseigné'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FiShield className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-1">Rôle</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {getRoleLabel(user.role)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* KYC Status */}
          <div className="card-gradient p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Vérification KYC</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-2">Statut de vérification</p>
                <span className={`inline-flex items-center px-4 py-2 rounded-full font-semibold ${getKYCStatusColor(user.kyc_status)}`}>
                  {getKYCStatusLabel(user.kyc_status)}
                </span>
              </div>
              {user.kyc_status === KYCStatus.NOT_SUBMITTED && (
                <button className="btn-primary">
                  Soumettre une vérification KYC
                </button>
              )}
            </div>
            {user.kyc_status === KYCStatus.NOT_SUBMITTED && (
              <p className="text-gray-600 mt-4">
                La vérification KYC est requise pour créer des campagnes et recevoir des dons.
              </p>
            )}
          </div>

          {/* Account Info */}
          <div className="card-gradient p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations du Compte</h2>
            <div className="space-y-4 text-gray-600">
              <div className="flex justify-between">
                <span>Compte vérifié</span>
                <span className="font-semibold">
                  {user.is_verified ? (
                    <span className="text-green-600">✓ Vérifié</span>
                  ) : (
                    <span className="text-yellow-600">En attente</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Date de création</span>
                <span className="font-semibold">
                  {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Dernière modification</span>
                <span className="font-semibold">
                  {new Date(user.updated_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
