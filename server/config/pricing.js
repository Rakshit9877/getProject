const pricing = {
  semi_built: 500,
  basic: 1000,
  extended: 1500,
};

const pricingLabels = {
  semi_built: 'Starter',
  basic: 'Standard Project',
  extended: 'Premium Project',
};

const complexityDescriptions = {
  semi_built: 'Base structure with partial implementation',
  basic: 'Fully functional project with clean and scalable code',
  extended: 'Advanced solution with scalability, performance optimization, and premium features for any domain',
};

const pricingFeatures = {
  semi_built: [
    'Project skeleton and folder structure',
    'Core functionality implemented',
    '2–3 features built, remaining for you to complete',
    'GitHub delivery',
    'Basic documentation',
  ],
  basic: [
    'Fully functional project',
    'All requested core features',
    'Clean, readable code',
    'GitHub delivery',
    'README with setup instructions',
  ],
  extended: [
    'Everything in Standard',
    'Additional advanced features',
    'UI polish and responsiveness',
    'GitHub delivery',
    'Full documentation and comments',
  ],
};

module.exports = { pricing, pricingLabels, complexityDescriptions, pricingFeatures };
