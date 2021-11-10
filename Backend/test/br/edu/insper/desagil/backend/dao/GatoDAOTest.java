package br.edu.insper.desagil.backend.dao;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import br.edu.insper.desagil.backend.Backend;
import br.edu.insper.desagil.backend.core.Gato;
import br.edu.insper.desagil.backend.database.firestore.Firestore;

class GatoDAOTest {
	private static String name;

	private GatoDAO dao;

	@BeforeAll
	public static void setUpClass() {
		name = Firestore.start(Backend.CREDENTIALS_TEST);
	}

	@BeforeEach
	void setUp() {
		dao = new GatoDAO();
		dao.deleteAll();
	}

	@Test
	void test() {
		Gato gato;
		gato = new Gato();
		gato.setNome("Nino");
		dao.create(gato);
		String key = gato.getKey();
		gato = dao.retrieve(key);
		assertEquals("Nino", gato.getNome());
	}

	@AfterAll
	public static void tearDownClass() {
		Firestore.stop(name);
	}
}
