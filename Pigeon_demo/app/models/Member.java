package models;

import java.util.HashSet;
import java.util.Set;
import io.ebean.*;

import javax.persistence.Entity;
import javax.persistence.Id;


@Entity
public class Member extends Model {

    @Id // id will be primary

    public Integer id;
    public String name;
    public String email;
    public String position;

    public static Finder<Integer, Member> find = new Finder<>(Member.class);

    /*
    // static databse

    public Member(){

    }

    public Member(Integer id, String name, String email, String position) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.position = position;
    }

    private static Set<Member> mems;

    static {
        mems = new HashSet<>();
        mems.add(new Member(1, "Nguyen Trung Kien", "ntkien@apcs.vn", "backend"));
        mems.add(new Member(2, "Le Phan Truong An", "lptan@apcs.vn", "backend"));
    }


    public static Set<Member> allMems() {
        return mems;
    }

    public static Member findbyID(Integer id) {
        for (Member mem : mems) {
            if (id.equals(mem.id)) {

                return mem;
            }
        }

        return null;
    }

    public static void add(Member mem) {
        mems.add(mem);
    }


    public static boolean remove(Member mem) {
        return mems.remove(mem);
    }
    */
}