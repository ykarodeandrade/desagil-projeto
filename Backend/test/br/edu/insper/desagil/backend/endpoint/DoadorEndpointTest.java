package br.edu.insper.desagil.backend.endpoint;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import br.edu.insper.desagil.backend.BackendTest;
import br.edu.insper.desagil.backend.core.Doador;
import br.edu.insper.desagil.backend.httpserver.EndpointTest;

class DoadorEndpointTest extends EndpointTest<Doador> {
	@BeforeEach
	public void setUp() {
		start(BackendTest.URL, "/doador");
		deleteList();
	}

	@Test
	public void test() {
		Doador doador;
		doador = new Doador();
		doador.setCpf("12345678910");
		post(doador);
		doador = get("cpf=12345678910");
		assertEquals("12345678910", doador.getCpf());
	}

	@AfterEach
	public void tearDown() {
		stop();
	}
}
