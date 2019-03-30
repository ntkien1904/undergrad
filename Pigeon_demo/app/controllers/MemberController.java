package controllers;

import models.Member;
import play.data.Form;

import play.data.FormFactory;
import play.mvc.Controller;
import play.mvc.Result;

import java.util.List;
import java.util.Set;

import views.html.members.*;

import javax.inject.Inject;



public class MemberController extends Controller{



    @Inject
    FormFactory form;


    // show first page
    public Result index(){

        List<Member> mems = Member.find.all();


        /*
        Set<Member> mems = Member.allMems();
        */
        return ok(index.render(mems));


    }



    // create new mem

    public Result create(){
        Form<Member> memForm = form.form(Member.class);
        return ok(create.render(memForm));
    }


    public Result save(){

        Form<Member> memForm = form.form(Member.class).bindFromRequest();
        Member mem = memForm.get();

        //Member.add(mem);
        mem.save();

        return redirect(routes.MemberController.index());
    }

    public Result edit(Integer id){

        //Member mem = Member.findbyID(id);
        Member mem = Member.find.byId(id);


        if(mem == null){
            return notFound("Member not found");

        }


        Form<Member> memForm = form.form(Member.class).fill(mem);
        return ok(edit.render(memForm));
    }

    public Result update(){
        Form<Member> memForm = form.form(Member.class).bindFromRequest();
        Member mem = memForm.get();

        //Member old = Member.findbyID(mem.id);

        Member old = Member.find.byId(mem.id);

        if(old == null){
            return notFound("Member not found");

        }

        old.name = mem.name;
        old.email = mem.email;
        old.position = mem.position;
        old.update();

        return redirect(routes.MemberController.index());
    }


    public Result delete(Integer id){

        //Member mem = Member.findbyID(id);
        Member mem = Member.find.byId(id);

        if(mem == null){
            return notFound("Member not found");

        }

        //Member.remove(mem);
        mem.delete();

        return redirect(routes.MemberController.index());
    }


    // mem details
    public Result show(Integer id){

        //Member mem = Member.findbyID(id);

        Member mem = Member.find.byId(id);

        if(mem == null){
            return notFound("Member not found");

        }
        return ok(show.render(mem));
    }


}
