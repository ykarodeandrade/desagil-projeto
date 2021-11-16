package br.edu.insper.desagil.backend.endpoint;

import java.util.List;

import br.edu.insper.desagil.backend.core.Doador;
import br.edu.insper.desagil.backend.dao.DoadorDAO;
import br.edu.insper.desagil.backend.httpserver.Args;
import br.edu.insper.desagil.backend.httpserver.Endpoint;
import br.edu.insper.desagil.backend.httpserver.Result;

public class DoadorEndpoint extends Endpoint<Doador> {
	private DoadorDAO dao;

	public DoadorEndpoint() {
		super("/doador");
		dao = new DoadorDAO();
	}

	@Override
	public Doador get(Args args) {
		String key = args.get("cpf");
		return dao.retrieve(key);
	}

	@Override
	public List<Doador> getList(Args args) {
		return dao.retrieveAll();
	}

	@Override
	public Result post(Args args, Doador doador) {
		dao.create(doador);
		return new Result();
	}

	@Override
	public Result put(Args args, Doador doador) {
		dao.update(doador);
		return new Result();
	}

	@Override
	public Result delete(Args args) {
		String key = args.get("cpf");
		dao.delete(key);
		return new Result();
	}

	@Override
	public Result deleteList(Args args) {
		dao.deleteAll();
		return new Result();
	}
}
