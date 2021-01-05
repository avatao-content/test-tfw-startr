from flask import jsonify, request, send_file, make_response
from app.api_v1 import bp
from tfwstartr import Startr


@bp.route("/languages", methods=["GET"])
def supported_languages():
    return jsonify({"supported_languages": Startr.get_starters()})


@bp.route("/info", methods=["GET"])
def starter_info():
    required_keys = ("language", "framework", "starter")
    if all(key in request.args for key in required_keys):
        return jsonify(
            Startr.get_starter_info(
                language_name=str(request.args.get("language")),
                framework_name=str(request.args.get("framework")),
                starter_name=str(request.args.get("starter")),
            )
        )
    return {
        "Error": f"Missing key(s): {[key for key in required_keys if key not in request.args]}"
    }


@bp.route("/assemble", methods=["POST"])
def assemble_starter():
    required_keys = ("language", "framework", "starter")
    if all(key in request.args for key in required_keys):
        with Startr() as startr:
            response = make_response(
                send_file(
                    startr.generate_starter(
                        language_name=request.json.get("language"),
                        framework_name=request.json.get("framework"),
                        starter_name=request.json.get("starter"),
                        extra_packages=request.json.get("modules"),
                    ),
                    as_attachment=True,
                )
            )
        response.headers[
            "Access-Control-Expose-Headers"
        ] = "content-type, content-disposition"
        return response
    return {
        "Error": f"Missing key(s): {[key for key in required_keys if key not in request.args]}"
    }
