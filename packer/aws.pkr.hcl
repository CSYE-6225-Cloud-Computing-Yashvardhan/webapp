packer {
    required_plugins {
        amazon = {
            version = "${var.plugin_version}"
            source  = "${var.plugin_source}" 
        }
    }
}


source "amazon-ebs" "csye6225-a04" {
    region          = "${var.aws_region}"
    ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
    ami_description = "${var.aws_ami_desc}"
    ami_users       = "${var.ami_users}"
    ami_regions = [
        var.aws_region
    ]

    aws_polling {
        delay_seconds = 120
        max_attempts  = 50
    }

    instance_type = "${var.instance_type}" 
    source_ami    = "${var.source_ami}"


    launch_block_device_mappings {
        delete_on_termination = true
        device_name           = "/dev/sda1"
        volume_size           = 8
        volume_type           = "gp2"
    }
}

build {
    sources = ["source.amazon-ebs.csye6225-a04"]

    provisioner "file" {
        source      = "./webapp.service"
        destination = "/tmp/webapp.service"
    }

    provisioner "file" {
        source      = "./webapp.zip"
        destination = "/home/csye6225/webapp.zip"
    }

    provisioner "shell" {
        environment_vars = [
        "DEBIAN_FRONTEND=noninteractive",
        "CHECKPOINT_DISABLE=1",
        "DB_NAME"="${var.db_name}"
        "DB_HOST"="${var.db_host}"
        "DB_PASSWORD=${var.db_password}"
        ]
        script = [
            "../scripts/user.sh",
            "../scripts/install.sh",
            "../scripts/webapp-setup.sh",
            "../scripts/systemd.sh"
        ]
    }

}