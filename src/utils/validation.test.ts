import test from 'node:test';
import assert from 'node:assert/strict';

function validateProjectIntake(name: string, email: string, description: string) {
  const errors: Record<string, string> = {};
  if (!name.trim()) errors.name = 'Please provide your name or organization.';
  if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = 'Please provide a valid contact email address.';
  }
  if (!description.trim() || description.trim().length < 15) {
    errors.description = 'Please provide at least 15 characters describing your project vision.';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

test('validateProjectIntake rejects empty fields', () => {
  const result = validateProjectIntake('', '', '');
  assert.equal(result.isValid, false);
  assert.equal(result.errors.name, 'Please provide your name or organization.');
  assert.equal(result.errors.email, 'Please provide a valid contact email address.');
  assert.equal(result.errors.description, 'Please provide at least 15 characters describing your project vision.');
});

test('validateProjectIntake accepts valid inputs', () => {
  const result = validateProjectIntake(
    'AnK Studio Lead',
    'contact@ankcreativemind.studio',
    'We want a custom 3D spatial interactive experience for our flagship release.'
  );
  assert.equal(result.isValid, true);
  assert.equal(Object.keys(result.errors).length, 0);
});

test('validateProjectIntake rejects short description', () => {
  const result = validateProjectIntake('Liam', 'liam@test.com', 'Too short');
  assert.equal(result.isValid, false);
  assert.ok(result.errors.description);
});
