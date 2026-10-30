/* CMV SARL – catalogue de la boutique
   Pour ajouter un produit : copiez un bloc { ... } et modifiez-le.
   type "materiel"  : accessoire livré (panier + commande WhatsApp/livraison)
   type "numerique" : fichier vendu en ligne (paiement sur le site, fichier remis automatiquement)
   paymentLink : lien de paiement fourni par votre prestataire (KKiaPay, FedaPay, etc.) – voir LISEZ-MOI.
   Supprimez les lignes "exemple: true" quand vos vrais produits sont prêts. */
const PRODUCTS = [
  { id: "m1", type: "materiel", categorie: "Informatique", nom: "Souris sans fil", prix: 3500, description: "Souris optique 2,4 GHz, récepteur USB.", image: "", exemple: true },
  { id: "m2", type: "materiel", categorie: "GSM", nom: "Chargeur rapide USB-C", prix: 4000, description: "Chargeur secteur avec câble USB-C.", image: "", exemple: true },
  { id: "m3", type: "materiel", categorie: "GSM", nom: "Écouteurs filaires", prix: 1500, description: "Écouteurs avec micro, prise jack 3,5 mm.", image: "", exemple: true },
  { id: "n1", type: "numerique", categorie: "Cours vidéo", nom: "Initiation à Excel (vidéos)", prix: 5000, description: "Cours vidéo pour débuter sur Excel.", image: "", paymentLink: "", exemple: true },
  { id: "n2", type: "numerique", categorie: "Documents", nom: "Modèles de CV et lettres (Word)", prix: 2000, description: "Pack de modèles modifiables.", image: "", paymentLink: "", exemple: true }
];
