export const sampleStands = [
  {
    id: 's1',
    title: 'Stand Vintage & Vinyles',
    fair: { name: 'Braderie de Lille', date: 'Aujourd\'hui' },
    distanceKm: 1.2,
    categories: ['Vinyles', 'Décoration'],
    priceFrom: 2,
    items: [
      { id: 'i1', title: 'Vinyle Pink Floyd', price: 8 },
      { id: 'i2', title: 'Affiche rétro', price: 12 },
      { id: 'i3', title: 'Lampe 70s', price: 25 },
    ],
    photos: ['/logo192.png'],
    location: { lat: 50.6372, lng: 3.0633, address: 'Lille centre' },
    description: 'Sélection de vinyles classiques, déco vintage et petites trouvailles.'
  },
  {
    id: 's2',
    title: 'Jouets & Jeux de société',
    fair: { name: 'Brocante du Vieux-Port', date: 'Ce week-end' },
    distanceKm: 3.8,
    categories: ['Jouets', 'Jeux de société'],
    priceFrom: 1,
    items: [
      { id: 'i4', title: 'Monopoly Édition 1995', price: 10 },
      { id: 'i5', title: 'Lego vrac', price: 5 },
      { id: 'i6', title: 'Peluches', price: 3 },
    ],
    photos: ['/logo192.png'],
    location: { lat: 43.2965, lng: 5.3698, address: 'Marseille' },
    description: 'Jouets pour enfants, jeux de société complets et en bon état.'
  },
  {
    id: 's3',
    title: 'Meubles Rétro',
    fair: { name: 'Vide-grenier Bellecour', date: 'Aujourd\'hui' },
    distanceKm: 8.5,
    categories: ['Meubles', 'Décoration'],
    priceFrom: 15,
    items: [
      { id: 'i7', title: 'Fauteuil velours', price: 60 },
      { id: 'i8', title: 'Table basse', price: 45 },
      { id: 'i9', title: 'Miroir ancien', price: 30 },
    ],
    photos: ['/logo192.png'],
    location: { lat: 45.7578, lng: 4.832, address: 'Lyon' },
    description: 'Meubles d\'occasion en bon état, style rétro et scandinave.'
  }
];
