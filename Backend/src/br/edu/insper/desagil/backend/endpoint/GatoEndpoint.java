package br.edu.insper.desagil.backend.endpoint;

import java.util.List;

import br.edu.insper.desagil.backend.core.Gato;
import br.edu.insper.desagil.backend.dao.GatoDAO;
import br.edu.insper.desagil.backend.httpserver.Args;
import br.edu.insper.desagil.backend.httpserver.Endpoint;
import br.edu.insper.desagil.backend.httpserver.Result;

public class GatoEndpoint extends Endpoint<Gato> {
	private GatoDAO dao;

	public GatoEndpoint() {
		super("/gato");
		dao = new GatoDAO();
	}

	@Override
	public Gato get(Args args) {
		String key = args.get("key");
		return dao.retrieve(key);
	}

	@Override
	public List<Gato> getList(Args args) {
		return dao.retrieveAll();
	}

	@Override
	public Result post(Args args, Gato gato) {
		dao.create(gato);
		Result result = new Result();
		result.put("key", gato.getKey());
		return result;
	}

	@Override
	public Result put(Args args, Gato gato) {
		dao.update(gato);
		return new Result();
	}

	@Override
	public Result delete(Args args) {
		String key = args.get("key");
		dao.delete(key);
		return new Result();
	}

	@Override
	public Result deleteList(Args args) {
		dao.deleteAll();
		return new Result();
	}
}
