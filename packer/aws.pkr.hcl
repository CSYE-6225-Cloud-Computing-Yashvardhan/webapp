packer {
  required_plugins {
    amazon = {
      version = " >=1.0.0, <2.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  type = string
}

variable "aws_ami_desc" {
  type = string
}

variable "source_ami" {
  type = string
}

variable "aws_access_key_id" {
  type = string
}

variable "aws_secret_access_key" {
  type = string
}

variable "ssh_username" {
  type = string
}

variable "subnet_id" {
  type = string
}

variable "db_host" {
  type = string
}

variable "db_name" {
  type = string
}

variable "db_user" {
  type = string
}

variable "db_password" {
  type = string
}

variable "instance_type" {
  type = string
}

variable "device_name" {
  type    = string
  default = "/dev/sda1"
}

variable "volume_size" {
  type    = number
  default = 8
}

variable "volume_type" {
  type    = string
  default = "gp2"
}

variable "scripts" {
  type    = list(string)
  default = ["./scripts/user.sh", "./scripts/install.sh", "./scripts/webapp-setup.sh", "./scripts/systemd.sh"]
}

variable "ami_users" {
  type    = list(string)
  default = ["050752609889"]
}

variable "delay_seconds" {
  type    = number
  default = 120
}

variable "max_attempts" {
  type    = number
  default = 50
}

source "amazon-ebs" "csye6225-a04" {
  region          = var.aws_region
  ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = var.aws_ami_desc
  access_key      = var.aws_access_key_id
  secret_key      = var.aws_secret_access_key
  ssh_username    = var.ssh_username
  instance_type   = var.instance_type
  source_ami      = var.source_ami
  ami_regions     = [var.aws_region]
  ami_users       = var.ami_users

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = var.device_name
    volume_size           = var.volume_size
    volume_type           = var.volume_type
  }

  aws_polling {
    delay_seconds = var.delay_seconds
    max_attempts  = var.max_attempts
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
    destination = "/tmp/webapp.zip"
  }

  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1",
      "DB_PASSWORD=${var.db_password}",
      "DB_USER=${var.db_user}",
      "DB_NAME=${var.db_name}",
      "DB_HOST=${var.db_host}"
    ]
    scripts = var.scripts
  }
}
