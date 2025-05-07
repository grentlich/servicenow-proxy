const axios = require('axios');

/**
 * Fonction proxy pour les requêtes vers l'API ServiceNow
 * 
 * @param {Object} req - La requête HTTP
 * @param {Object} res - La réponse HTTP
 */
exports.serviceNowProxy = async (req, res) => {
  // Configuration des en-têtes CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', '*');
  res.set('Access-Control-Allow-Credentials', 'true');
  
  // Gestion des requêtes OPTIONS (pre-flight)
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  // Log request method and headers for debugging
  console.log('Request method:', req.method);
  console.log('Request headers:', JSON.stringify(req.headers));
  
  // Vérification de la méthode HTTP
  if (req.method !== 'POST') {
    console.error('Méthode non autorisée:', req.method);
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }
  
  try {
    // Log the raw request body
    console.log('Raw request body:', JSON.stringify(req.body));
    
    // Extraction des données de la requête
    const { query, table, fields, token, baseUrl } = req.body;
    
    // Validation des données requises
    if (!query || !table || !fields || !token || !baseUrl) {
      console.error('Données manquantes dans la requête:', JSON.stringify(req.body));
      return res.status(400).json({ error: 'Données manquantes dans la requête' });
    }
    
    console.log(`Requête reçue pour la table ${table} avec la recherche: ${query}`);
    
    // Construction de l'URL de l'API ServiceNow
    const serviceNowUrl = `${baseUrl}/api/now/sp/search`;
    
    // Préparation des paramètres de requête
    const params = {};
    
    // Create request data for POST body
    const data = {
      query: query,
      fields: fields
    };
    
    // Configuration des en-têtes pour la requête ServiceNow
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent':'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36'

    };
    
    console.log(`Envoi de la requête à: ${serviceNowUrl}`);
    console.log('Data:', JSON.stringify(data));
    console.log('Headers:', JSON.stringify(headers));
    
    // Appel à l'API ServiceNow
    const response = await axios({
      method: 'post',
      url: serviceNowUrl,
      headers: headers,
      data: data 
    });
    
    console.log('Réponse reçue de ServiceNow avec status:', response.status);
    console.log('Response data preview:', JSON.stringify(response.data).substring(0, 200) + '...');
    
    // Retour de la réponse au client
    return res.status(response.status).json(response.data);
    
  } catch (error) {
    console.error('Erreur lors de la requête:', error.message);
    
    // Log more detailed error information
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', JSON.stringify(error.response.data));
      return res.status(error.response.status).json({
        error: 'Erreur ServiceNow',
        details: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', JSON.stringify(error.request));
      return res.status(500).json({
        error: 'Erreur de connexion',
        message: 'Aucune réponse reçue de ServiceNow'
      });
    }
    
    // Gestion des autres erreurs
    return res.status(500).json({
      error: 'Erreur interne du serveur',
      message: error.message
    });
  }
};