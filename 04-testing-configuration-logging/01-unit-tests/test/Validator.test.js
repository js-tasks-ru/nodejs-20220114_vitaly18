const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });
    it('валидатор проверяет строковые поля (макс)', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 'Wolfeschlegelsteinhausenbergerdorff' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 35');
    });
    it('валидатор проверяет строковые поля (нет ошибок)', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 'Wolfenstein' });

      expect(errors).to.have.length(0);
    });
    it('валидатор проверяет числовые поля', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 60,
        },
      });

      const errors = validator.validate({ age: 66 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 60, got 66');
    });
    it('валидатор проверяет числовые поля (мин)', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 60,
        },
      });

      const errors = validator.validate({ age: 17 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 18, got 17');
    });
    it('валидатор проверяет числовые поля (нет ошибок)', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 60,
        },
      });

      const errors = validator.validate({ age: 18 });

      expect(errors).to.have.length(0);
    });
    it('валидатор проверяет тип', () => {
      const validator = new Validator({
        surname: {
          type: 'string',
          min: 4,
          max: 200,
        },
      });

      const value = {surname: []};

      const errors = validator.validate(value);

      expect(errors).to.have.length(1);

      expect(errors[0]).to.have.property('field').and.to.be.equal('surname');
      expect(errors[0]).to.have.property('error').and.to.be.equal(
          `expect ${validator.rules.surname.type}, got ${typeof value.surname}`,
      );
    });
    it('валидатор проверяет тип (нет ошибок)', () => {
      const validator = new Validator({
        surname: {
          type: 'string',
          min: 4,
          max: 200,
        },
      });

      const value = {surname: 'Ivanov'};

      const errors = validator.validate(value);

      expect(errors).to.have.length(0);
    });
  });
});