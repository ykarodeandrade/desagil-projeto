package br.edu.insper.desagil.backend.endpoint;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import br.edu.insper.desagil.backend.BackendTest;
import br.edu.insper.desagil.backend.core.Gato;
import br.edu.insper.desagil.backend.httpserver.EndpointTest;
import br.edu.insper.desagil.backend.httpserver.Result;

class GatoEndpointTest extends EndpointTest<Gato> {
	@BeforeEach
	public void setUp() {
		start(BackendTest.URL, "/gato");
		deleteList();
	}

	@Test
	public void test() {
		Gato gato;
		gato = new Gato();
		gato.setNome("Nino");
		Result result = post(gato);
		String key = (String) result.get("key");
		gato = get("key=" + key);
		assertEquals("Nino", gato.getNome());
	}

	@AfterEach
	public void tearDown() {
		stop();
	}
}
