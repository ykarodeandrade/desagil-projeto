package br.edu.insper.desagil.backend.core;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class DoadorTest {
	private Doador doador;

	@BeforeEach
	void setUp() {
		doador = new Doador();
	}

	@Test
	void test() {
		doador.setCpf("12345678910");
		assertEquals("12345678910", doador.getCpf());
	}
}
