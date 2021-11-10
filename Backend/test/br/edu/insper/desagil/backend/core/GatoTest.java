package br.edu.insper.desagil.backend.core;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class GatoTest {
	private Gato gato;

	@BeforeEach
	void setUp() {
		gato = new Gato();
	}

	@Test
	void test() {
		gato.setNome("Nino");
		assertEquals("Nino", gato.getNome());
	}
}
