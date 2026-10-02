import { analysisService } from '../services/AnalysisService';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`[PASS] ${message}`);
  } else {
    failed++;
    console.error(`[FAIL] ${message}`);
  }
}

async function runTests() {
  console.log('=== SEMANTIC CONTRACT TEST SUITE EXECUTION ===\n');

  // TEST 1: Suspicious message
  const r1 = await analysisService.analyzeText('We are SEBI registered investment advisors. Guaranteed 50% monthly profit! Transfer ₹10,000 to our VIP UPI now.');
  assert(r1.claims.length > 0, 'TEST 1: Suspicious message - claims detected');
  assert(r1.riskSignals.length > 0, 'TEST 1: Suspicious message - multiple risk signals');
  assert(r1.evidence.length > 0, 'TEST 1: Suspicious message - relevant evidence');
  assert(r1.uncertaintyItems.length > 0, 'TEST 1: Suspicious message - relevant uncertainty');
  assert(r1.recommendedSafeActions.length > 0, 'TEST 1: Suspicious message - relevant safe actions');

  // TEST 2: Legitimate educational message
  const r2 = await analysisService.analyzeText('Understanding Stock Market Basics: Equity investments carry market risk. Always diversify your portfolio.');
  assert(r2.riskSignals.length === 0, 'TEST 2: Legitimate educational - zero false risk signals');
  assert(r2.evidence.length === 0, 'TEST 2: Legitimate educational - zero unrelated evidence');
  assert(r2.recommendedSafeActions.length === 0, 'TEST 2: Legitimate educational - zero unrelated safe actions');

  // TEST 3: Educational disclaimer
  const r3 = await analysisService.analyzeText('Note: Beware of fraudsters offering guaranteed returns of 20% daily on WhatsApp.');
  assert(!r3.riskSignals.some(s => s.code === 'GUARANTEED_RETURNS'), 'TEST 3: Educational disclaimer - no false guaranteed-return signal');
  assert(!r3.riskSignals.some(s => s.code === 'DIRECT_PAYMENT_REQUEST'), 'TEST 3: Educational disclaimer - no false payment signal');

  // TEST 4: OTP education
  const r4 = await analysisService.analyzeText('Bank Safety Tip: Never share your secret OTP or password with anyone posing as bank staff.');
  assert(!r4.riskSignals.some(s => s.code === 'DIRECT_PAYMENT_REQUEST'), 'TEST 4: OTP education - no false payment signal');

  // TEST 5: Scam awareness content
  const r5 = await analysisService.analyzeText('Educational Guide: How fraudsters trick investors with fake trading apps promising 100% fixed return.');
  assert(!r5.riskSignals.some(s => s.code === 'GUARANTEED_RETURNS'), 'TEST 5: Scam awareness - no inappropriate guaranteed-return signal');

  // TEST 6: Real payment request
  const r6 = await analysisService.analyzeText('Deposit ₹5,000 now to unlock your VIP trading signals account.');
  assert(r6.riskSignals.some(s => s.code === 'DIRECT_PAYMENT_REQUEST'), 'TEST 6: Real payment request - DIRECT_PAYMENT_REQUEST detected');
  assert(r6.recommendedSafeActions.some(a => a.id === 'sa_do_now_payment'), 'TEST 6: Real payment request - payment safety action generated');

  // TEST 7: Regulatory identity claim
  const r7 = await analysisService.analyzeText('We are a SEBI registered research analyst entity registration number INH000001234.');
  assert(r7.claims.some(c => c.category === 'REGULATORY_IDENTITY'), 'TEST 7: Regulatory claim - claim detected');
  assert(r7.claims.every(c => c.evidenceStatus === 'UNVERIFIED'), 'TEST 7: Regulatory claim - never falsely marked SUPPORTED/CONTRADICTED without actual verification');

  // TEST 8: Off-platform educational content
  const r8 = await analysisService.analyzeText('To report cyber fraud, visit the official government portal at cybercrime.gov.in.');
  assert(r8.riskSignals.length === 0, 'TEST 8: Off-platform education - no automatic fraud verdict');

  // TEST 9: Unrelated market-hours text
  const r9 = await analysisService.analyzeText('Indian stock markets will remain closed on national holidays according to the exchange calendar.');
  assert(r9.evidence.length === 0, 'TEST 9: Market hours - no manufactured evidence');
  assert(r9.uncertaintyItems.length === 0, 'TEST 9: Market hours - no manufactured uncertainty');
  assert(r9.recommendedSafeActions.length === 0, 'TEST 9: Market hours - no manufactured safe actions');

  // TEST 10: Evidence semantics
  const r10 = await analysisService.analyzeText('SEBI Reg No INA00009999');
  assert(!r10.evidence.some(e => e.explanation.includes('verified with official registry')), 'TEST 10: Evidence semantics - no live registry lookup means no registry verification claim');

  // TEST 11: Condition-dependent evidence
  const r11a = await analysisService.analyzeText('Pay ₹5,000 registration fee today.');
  assert(!r11a.evidence.some(e => e.id === 'ev_guaranteed_rule'), 'TEST 11: Payment-only message does not receive SEBI guaranteed return evidence');
  const r11b = await analysisService.analyzeText('We are SEBI registered investment advisors offering 50% guaranteed monthly return.');
  assert(r11b.evidence.some(e => e.id === 'ev_guaranteed_rule'), 'TEST 11: Regulatory message receives relevant regulatory guidance');

  // TEST 12: Condition-dependent actions
  const r12a = await analysisService.analyzeText('Transfer INR 5000 right now');
  assert(r12a.recommendedSafeActions.some(a => a.id === 'sa_do_now_payment'), 'TEST 12: Payment request -> payment safety action');
  const r12b = await analysisService.analyzeText('We are SEBI registered research analyst');
  assert(r12b.recommendedSafeActions.some(a => a.id === 'sa_verify_reg'), 'TEST 12: Regulatory claim -> independent verification action');
  const r12c = await analysisService.analyzeText('Random stock market text with no claims or risk');
  assert(r12c.recommendedSafeActions.length === 0, 'TEST 12: No relevant condition -> no irrelevant actions');

  // TEST 13: Target prompt match
  const r13 = await analysisService.analyzeText('Pay ₹5,000 registration fee today.');
  assert(r13.riskSignals.some(s => s.code === 'DIRECT_PAYMENT_REQUEST'), 'TEST 13: Target prompt "Pay ₹5,000 registration fee today." -> DIRECT_PAYMENT_REQUEST detected');

  // TEST 14: Payment request variations
  const paymentExamples = [
    'Deposit Rs 5000 now',
    'Transfer INR 10000',
    'Pay 2000 rupees',
    'Send ₹2500 via UPI',
    'Pay the registration fee of ₹5000'
  ];
  for (const ex of paymentExamples) {
    const res = await analysisService.analyzeText(ex);
    assert(res.riskSignals.some(s => s.code === 'DIRECT_PAYMENT_REQUEST'), `TEST 14: Payment variation "${ex}" detected`);
  }

  // TEST 15: Payment negation suppression
  const r15 = await analysisService.analyzeText('Never pay ₹5,000 to unknown UPI accounts.');
  assert(!r15.riskSignals.some(s => s.code === 'DIRECT_PAYMENT_REQUEST'), 'TEST 15: Payment warning "Never pay ₹5,000..." does not trigger risk signal');

  // TEST 16: Educational scam article suppression
  const r16 = await analysisService.analyzeText('Learn about payment scams that ask victims to deposit ₹5,000.');
  assert(!r16.riskSignals.some(s => s.code === 'DIRECT_PAYMENT_REQUEST'), 'TEST 16: Scam awareness "Learn about payment scams..." does not trigger risk signal');

  // TEST 17: Full pipeline integration for payment request
  const r17 = await analysisService.analyzeText('Pay ₹5,000 registration fee today.');
  assert(r17.claims.some(c => c.category === 'PAYMENT_REQUEST'), 'TEST 17: Full pipeline - payment claim extracted');
  assert(r17.riskSignals.some(s => s.code === 'DIRECT_PAYMENT_REQUEST'), 'TEST 17: Full pipeline - payment risk signal detected');
  assert(r17.recommendedSafeActions.some(a => a.id === 'sa_do_now_payment'), 'TEST 17: Full pipeline - payment safety action generated');
  assert(!r17.evidence.some(e => e.id === 'ev_guaranteed_rule'), 'TEST 17: Full pipeline - no manufactured SEBI evidence');

  console.log(`\n========================================`);
  console.log(`TOTAL TESTS EXECUTED: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
