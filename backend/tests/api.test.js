import assert from 'assert';
import http from 'http';
import { app } from '../src/app.js';
import { prisma } from '../src/database/prisma.js';

const PORT = 5099;
let server;

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const opt = {
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method: options.method || 'GET',
      headers: { ...defaultHeaders, ...options.headers },
    };

    const req = http.request(opt, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : {},
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting TeaML India Edition Integration Tests...');

  // Start temporary test server
  server = app.listen(PORT);

  try {
    // 1. Test Health Endpoint
    const health = await request('/api/health');
    assert.strictEqual(health.status, 200, 'Health check returns 200');
    assert.strictEqual(health.body.status || health.body.data?.status, 'healthy', 'Health status is healthy');
    console.log('✅ PASSED: Health check returns 200 & healthy');

    // 2. Test Teas Catalog
    const teas = await request('/api/teas?limit=10');
    assert.strictEqual(teas.status, 200, 'Teas catalog returns 200');
    assert.strictEqual(teas.body.data.length, 10, 'Returns 10 tea blends');
    assert(teas.body.data[0].price > 0, 'Tea blend has valid price in ₹');
    console.log('✅ PASSED: Indian teas catalog returns 200 with ₹ prices');

    // 3. Test Featured Teas
    const feat = await request('/api/teas/featured');
    assert.strictEqual(feat.status, 200, 'Featured teas returns 200');
    assert(feat.body.data.length > 0, 'Returns featured tea blends');
    console.log('✅ PASSED: Featured Indian teas endpoint returns 200');

    // 4. Test Single Tea Blend Detail
    const sampleId = teas.body.data[0].id;
    const singleTea = await request(`/api/teas/${sampleId}`);
    assert.strictEqual(singleTea.status, 200, 'Single tea returns 200');
    assert.strictEqual(singleTea.body.data.id, sampleId, 'Fetched correct tea ID');
    console.log('✅ PASSED: Single tea detail returns 200 with sensory data');

    // 5. Test AI Recommendation Pipeline (19 Indian inputs)
    const quizInputs = {
      age: 28,
      country: 'North India',
      climate: 'Monsoon / Humid',
      teaFrequency: 'Daily (2-3 cups Kadak Chai)',
      favoriteFlavours: ['Cardamom (Elaichi)', 'Ginger (Adrak)', 'Saffron (Kesar)'],
      teaStrength: 'Bold & Strong',
      sugarPreference: 'Slightly Sweet (or Jaggery/Gur)',
      milkPreference: 'Rich Milk Tea (Kadak Chai)',
      spicePreference: 8,
      floralPreference: 4,
      aromaPreference: 9,
      mood: 'Calm',
      stressLevel: 6,
      sleepQuality: 'Average',
      healthGoals: ['Stress Relief & Calming', 'Immunity Fortification (Kadha)'],
      budget: 'Premium Single-Estate (₹500 - ₹1,200)',
      teaBrands: 'Indian Artisan Estates (Makaibari, Halmari)',
      caffeineTolerance: 'Moderate Caffeine',
      preparationStyle: 'Simmered Stove-top Pot (Kadak Chai)',
      modelOverride: 'hybrid',
    };

    const pred = await request('/api/recommendations/predict', {
      method: 'POST',
      body: quizInputs,
    });
    assert.strictEqual(pred.status, 200, 'Prediction returns 200');
    assert(pred.body.data.recommendations.length > 0, 'Returned recommendations array');
    console.log('✅ PASSED: Indian Chai Recommendation prediction returns 200 with XAI');

    // 6. Test Model Comparison
    const compare = await request('/api/recommendations/models/compare');
    assert.strictEqual(compare.status, 200, 'Model comparison returns 200');
    assert(compare.body.data.length >= 4, 'Contains 4 recommender benchmarks');
    console.log('✅ PASSED: ML algorithm benchmark comparison returns 200');

    // 7. Test AI Sommelier Chat
    const chat = await request('/api/chat', {
      method: 'POST',
      body: { message: 'How do I brew authentic Kadak Masala Chai?' },
    });
    assert.strictEqual(chat.status, 200, 'Chat returns 200');
    assert(chat.body.data.response.length > 0, 'Received sommelier response');
    console.log('✅ PASSED: Indian AI Sommelier chat returns 200 with brewing instructions');

    // 8. Test Analytics
    const analytics = await request('/api/analytics/dashboard');
    assert.strictEqual(analytics.status, 200, 'Analytics dashboard returns 200');
    assert(analytics.body.data.kpis.totalTeas >= 1000, 'Total teas is at least 1,000');
    console.log('✅ PASSED: Analytics dashboard returns 200');

    // 9. Test Frictionless Review Submission
    const reviewRes = await request('/api/reviews', {
      method: 'POST',
      body: {
        teaId: sampleId,
        rating: 5,
        title: 'Outstanding Cardamom Aroma',
        comment: 'Steeped perfectly with fresh crushed ginger. Highly recommended!',
      },
    });
    assert.strictEqual(reviewRes.status, 201, 'Review creation succeeds without login');
    console.log('✅ PASSED: Frictionless review posting succeeds with 201');

    // 10. Test Frictionless Mood Log
    const moodRes = await request('/api/moods', {
      method: 'POST',
      body: {
        mood: 'Calm',
        stressLevel: 4,
        energyLevel: 7,
        note: 'Afternoon ginger chai recharge',
      },
    });
    assert.strictEqual(moodRes.status, 201, 'Mood logging succeeds without login');
    console.log('✅ PASSED: Frictionless Ayurvedic mood logging succeeds with 201');

    console.log('\n🎉 ALL 10/10 INTEGRATION TESTS PASSED FOR INDIA EDITION!');
  } catch (err) {
    console.error('\n❌ Test run failed:', err);
    process.exit(1);
  } finally {
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  }
}

runTests();
